from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import (PendingMeeting,
                     FinalizedMeeting,
                     TimeSlot,
                     Participant,
                     SuggestedSchedule,
                     SuggestedTimeSlot,
                     Priority)
from Account.models import User, Notification
from .serializers import (PendingMeetingSerializer,
                          PendingMeetingDetailSerializer,
                          FinalizedMeetingSerializer,
                          PendingMeetingCreateSerializer,
                          TimeSlotCreateSerializer,
                          ParticipantCreateSerializer,
                          PendingMeetingUpdateSerializer,
                          ParticipantUpdateSerializer,)
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework.decorators import api_view, permission_classes
from .suggest_schedule import suggest_schedule
from django.core.mail import EmailMessage
from datetime import datetime, timedelta
from rest_framework import serializers


def send_email(subject, message, recipient_list, reply_to):
    try:
        email = EmailMessage(
            subject=subject,
            body=message,
            from_email='no-reply309@outlook.com',
            to=recipient_list,
            reply_to=reply_to,
        )
        count = email.send()
    except Exception as e:
        print(e)
        count = 0
    return count


class PendingMeetingList(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary='List Pending Meetings',
        description='Retrieve a list of all pending meetings filtered by the owner.',
        responses={200: PendingMeetingSerializer(many=True)},
    )
    def get(self, request):
        meetings = PendingMeeting.objects.filter(owner=request.user)
        serializer = PendingMeetingSerializer(meetings, many=True)
        return Response(serializer.data)


class PendingMeetingCreateView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary='Create Pending Meeting',
        description='Allows the creation of a new pending meeting. '
                    'Time_limit must be a multiple of 30 minutes. '
                    'Deadline must be in the future.',
        request=PendingMeetingCreateSerializer,
        responses={201: PendingMeetingCreateSerializer},
    )
    def post(self, request):
        serializer = PendingMeetingCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            meeting = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PendingMeetingUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary='Update Pending Meeting',
        description='Updates specified details (title, message, deadline, time limit) of a pending meeting. '
                    'Time_limit must be a multiple of 30 minutes. '
                    'Deadline must be in the future. '
                    'If deadline or time limit is changed, remove all related time slots of the meeting.',
        request=PendingMeetingUpdateSerializer,
        responses={200: PendingMeetingDetailSerializer},
    )
    def patch(self, request, meeting_id):
        try:
            meeting = PendingMeeting.objects.get(id=meeting_id, owner=request.user)
            serializer = PendingMeetingUpdateSerializer(meeting, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                detail_serializer = PendingMeetingDetailSerializer(serializer.instance)
                return Response(detail_serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except PendingMeeting.DoesNotExist:
            return Response({'detail': 'Pending Meeting not found.'}, status=status.HTTP_404_NOT_FOUND)


class ParticipantUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary='Update Participant Response',
        description='Updates the response of a participant to a pending meeting. '
                    'Response time must earlier than the meeting deadline. ',
        request=ParticipantUpdateSerializer,
        responses={200: ParticipantUpdateSerializer},
    )
    def patch(self, request, meeting_id, user_id):
        try:
            participant = Participant.objects.get(meeting_id=meeting_id, user_id=user_id)
            serializer = ParticipantUpdateSerializer(participant, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Participant.DoesNotExist:
            return Response({'detail': 'Participant not found.'}, status=status.HTTP_404_NOT_FOUND)


class TimeSlotCreateView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary='Create Time Slot',
        description='Create a new time slot for a pending meeting. '
                    'Prrority must be 0 or 1. '
                    'Start time must be at a 00 or 30 minute mark. '
                    'If the request user is a participant, the time slot must align with the owner\'s time slot. '
                    'If the request user is the owner, the time slot must not overlap with existing finalized meetings.',
        request=TimeSlotCreateSerializer,
        responses={201: TimeSlotCreateSerializer},
    )
    def post(self, request):
        serializer = TimeSlotCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            time_slot = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TimeSlotDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary='Delete Time Slot(s)',
        description='Deletes time slots associated with a meeting. '
                    'If the request user is the meeting owner, all time slots for the meeting are deleted. '
                    'If the request user is a participant, only their time slots are deleted.',
    )
    def delete(self, request, meeting_id):
        try:
            meeting = PendingMeeting.objects.get(id=meeting_id)
            user = request.user

            # If the request user is the meeting's owner, delete all time slots for the meeting
            if meeting.owner == user:
                TimeSlot.objects.filter(meeting=meeting).delete()
            else:
                # Check if the request user is a participant of the meeting
                if not Participant.objects.filter(meeting=meeting, user=user).exists():
                    return Response({'detail': 'User is not a participant of this meeting.'},
                                    status=status.HTTP_403_FORBIDDEN)

                # Request user is a participant, so delete only their time slots
                TimeSlot.objects.filter(meeting=meeting, user=user).delete()

            return Response(status=status.HTTP_204_NO_CONTENT)
        except PendingMeeting.DoesNotExist:
            return Response({'detail': 'Meeting not found.'}, status=status.HTTP_404_NOT_FOUND)


class ParticipantCreateView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary='Add Participant to Meeting',
        description='Add a new participant to a pending meeting. '
                    'Request user must be the meeting owner. '
                    'The provided user is a contact of the meeting owner.',
        request=ParticipantCreateSerializer,
        responses={201: ParticipantCreateSerializer},
    )
    def post(self, request):
        serializer = ParticipantCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            participant = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ParticipantDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary='Delete Participant',
        description='Deletes a participant and associated time slot by meeting ID and participant ID.',
    )
    def delete(self, request, meeting_id, user_id):  # Adjusted method signature to include URL parameters
        try:
            meeting = PendingMeeting.objects.get(id=meeting_id)
            if meeting.owner != request.user:
                return Response({'detail': 'Only the meeting owner can delete participants.'},
                                status=status.HTTP_403_FORBIDDEN)

            participant = Participant.objects.get(meeting_id=meeting_id, user_id=user_id)
            TimeSlot.objects.filter(meeting_id=meeting_id, user_id=user_id).delete()
            participant.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except PendingMeeting.DoesNotExist:
            return Response({'detail': 'Meeting not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Participant.DoesNotExist:
            return Response({'detail': 'Participant not found.'}, status=status.HTTP_404_NOT_FOUND)


class FinalizedMeetingList(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary='List Finalized Meetings',
        description='Retrieve a list of finalized (scheduled) meetings filtered by the meeting owner.',
        responses={200: FinalizedMeetingSerializer(many=True)},
    )
    def get(self, request):
        meetings = FinalizedMeeting.objects.filter(owner=request.user)
        serializer = FinalizedMeetingSerializer(meetings, many=True)
        return Response(serializer.data)

@extend_schema(
    summary='Get Pending Meetings',
    description='Retrieve a pending meeting by the meeting id',
    responses={
        200: inline_serializer(
            name='PendingMeetingResponse',
            fields={
                'title': serializers.CharField(),
                'deadline': serializers.DateTimeField(),
                'time_limit': serializers.IntegerField(),
                'message': serializers.CharField(),
                'time_slot': serializers.ListField(
                    child=inline_serializer(
                        name='TimeSlot',
                        fields={
                            "start_time": serializers.DateTimeField(),
                            "priority": serializers.IntegerField()
                        }
                    )
                )
            }
        ),
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pending_meeting(request, meeting_id):
    try:
        meeting = PendingMeeting.objects.get(pk=meeting_id)
        permission = False
        if request.user == meeting.owner:
            permission = True
        if not permission:
            participants_users = User.objects.filter(participant__meeting_id=meeting_id)
            print(participants_users)
            for user in participants_users:
                if request.user == user:
                    permission = True
            if not permission:
                return Response({"error": "You do not have permission to view this meeting."},
                                status=status.HTTP_403_FORBIDDEN)

        time_slots = TimeSlot.objects.filter(meeting=meeting, user=meeting.owner)

        time_slots_data = [{
            "start_time": time_slot.start_time,
            "priority": time_slot.priority,
        } for time_slot in time_slots]

        meeting_data = {
            "title": meeting.title,
            "deadline": meeting.deadline,
            "time_limit": meeting.time_limit,
            "message": meeting.message,
            "time_slots": time_slots_data,
        }
        return Response(meeting_data)
    except PendingMeeting.DoesNotExist:
        return Response({"error": "Meeting not found"}, status=status.HTTP_404_NOT_FOUND)

@extend_schema(
    summary='Get Meeting Participants',
    description="Retrieve a meeting's participants by the meeting id",
    responses={
        200: inline_serializer(
            name='Participants',
            fields={
                'participants': serializers.ListField(
                    child=inline_serializer(
                        name='Participant',
                        fields={
                            "first_name": serializers.CharField(),
                            "last_name": serializers.CharField(),
                            "id": serializers.IntegerField(),
                            "response": serializers.BooleanField,
                            "response_time": serializers.DateTimeField(),
                            "content": serializers.CharField(),
                        }
                    )
                )
            }
        ),
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_meeting_participants(request, meeting_id):
    try:
        meeting = PendingMeeting.objects.get(pk=meeting_id)
        if request.user != meeting.owner:
            return Response({"error": "You do not have permission to view this meeting."},
                            status=status.HTTP_403_FORBIDDEN)
        participants = Participant.objects.filter(meeting=meeting).select_related('user').order_by('-response')
        participants_info = [
            {
                "first_name": participant.user.first_name,
                "last_name": participant.user.last_name,
                "id": participant.user.id,
                "response": participant.response,
                "response_time": participant.response_time,
                "content": participant.content
            }
            for participant in participants
        ]
        # Return as JSON response
        return Response({"participants": participants_info})
    except PendingMeeting.DoesNotExist:
        return Response({"error": "Meeting not found"}, status=status.HTTP_404_NOT_FOUND)

@extend_schema(
    summary="Get Participant's Time Slots",
    description="Retrieve a participant's time slots by the meeting id and user id",
    responses={
        200: inline_serializer(
            name='TimeSlots',
            fields={
                'time_slots': serializers.ListField(
                    child=inline_serializer(
                        name='time_slot',
                        fields={
                            "start_time": serializers.DateTimeField(),
                            "priority": serializers.IntegerField()
                        }
                    )
                )
            }
        ),
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_participant_response(request, meeting_id, user_id):
    try:
        meeting = PendingMeeting.objects.get(pk=meeting_id)
        if request.user != meeting.owner:
            return Response({"error": "You do not have permission to view this meeting."},
                            status=status.HTTP_403_FORBIDDEN)
    except PendingMeeting.DoesNotExist:
        return Response({"error": "Meeting not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        participant = Participant.objects.get(meeting__id=meeting_id, user__id=user_id)
        if not participant.response:
            return Response({"error": "Participant not responded"}, status=status.HTTP_404_NOT_FOUND)
    except Participant.DoesNotExist:
        return Response({"error": "Participant not found"}, status=status.HTTP_404_NOT_FOUND)

    time_slots = TimeSlot.objects.filter(meeting__id=meeting_id, user__id=user_id)

    time_slots_data = [
        {
            "start_time": time_slot.start_time.isoformat(),
            "priority": time_slot.priority,
        }
        for time_slot in time_slots
    ]
    return Response({"time_slots": time_slots_data})

@extend_schema(
    summary='Delete Pending Meeting',
    description='Deletes a pending time by meeting ID.',
    responses={
            200: inline_serializer(
                name='Message',
                fields={
                    'message': serializers.CharField()
                }
            ),
    }
)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_pending_meeting(request, meeting_id):
    try:
        meeting = PendingMeeting.objects.get(pk=meeting_id)
    except PendingMeeting.DoesNotExist:
        return Response({"error": "PendingMeeting not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.user != meeting.owner:
        return Response({"error": "You do not have permission to delete this meeting."},
                        status=status.HTTP_403_FORBIDDEN)

    meeting.delete()

    return Response({"message": "PendingMeeting deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

@extend_schema(
    summary="Notify Participants",
    description="Notify Participants that did not respond to the meeting scheduling",
    request={
        "application/json": {
            "type": "object",
            "properties": {
                "meeting_id": {
                    "type": "integer",
                    "description": "id of the meeting"
                }
            },
            "required": ["meeting_id"],
            "example": {
                "meeting_id": "1",
            }
        }
    },
    responses={
        200: inline_serializer(
            name='Message',
            fields={
                'message': serializers.CharField(),
            }
        ),
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def notify_not_responded_invitees(request):
    data = request.data
    meeting_id = data.get('meeting_id')
    try:
        meeting = PendingMeeting.objects.get(pk=meeting_id)
    except PendingMeeting.DoesNotExist:
        return Response({"error": "PendingMeeting not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.user != meeting.owner:
        return Response({"error": "You do not have permission to notify this meeting's invitees."},
                        status=status.HTTP_403_FORBIDDEN)

    reply_to = [meeting.owner.email]
    subject = "Meeting Scheduling Notification"
    emails = Participant.objects.filter(meeting=meeting, response=False).values_list('user__email', flat=True)
    email_sent = 0
    for email in emails:
        message = (f"{meeting.owner.first_name} {meeting.owner.last_name} notified you for meeting scheduling.\n"
                   f"Meeting Title: {meeting.title} \n"
                   f"Meeting Duration: {meeting.time_limit} \n"
                   f"Scheduling Deadline: {meeting.deadline.strftime('%Y-%m-%d %H:%M:%S')} \n"
                   f"Meeting Message: {meeting.message} \n"
                   f"Schedule Link: http://127.0.0.1:8000/api/meeting/create/"
                   )
        email_sent += send_email(subject, message, [email], reply_to)

    if email_sent > 0:
        email_message = f"{email_sent} emails are sent successfully."
    else:
        email_message = "Failed to send email."

    return Response({"message": "Successfully notify invitees that did no respond. " + email_message}, status=status.HTTP_201_CREATED)

@extend_schema(
    summary="Post Finalized Meeting",
    description="Create a finalized meeting",
    request={
        "application/json": {
            "example": {
                "meeting_id": "1",
                "slots": [
                {
                    "user": 2,
                    "time": "2024-03-31 13:00:00"
                },
                ],
                "leftovers": [
                    {
                        "user": 3
                    }
                ]
            }
        }
    },
    responses={
        200: inline_serializer(
            name='Message',
            fields={
                'message': serializers.CharField(),
            }
        ),
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def post_finalized_meetings(request):
    data = request.data
    meeting_id = data.get('meeting_id')
    slots = data.get('slots')
    left_overs = data.get('leftovers')

    try:
        meeting = PendingMeeting.objects.get(pk=meeting_id)
    except PendingMeeting.DoesNotExist:
        return Response({"error": "PendingMeeting not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.user != meeting.owner:
        return Response({"error": "You do not have permission to finalize this meeting."},
                        status=status.HTTP_403_FORBIDDEN)

    invitees = Participant.objects.filter(meeting=meeting, response=True).values_list('user_id', flat=True)
    invitees_check_remaining = set(invitees)
    owner_time_slots = TimeSlot.objects.filter(meeting_id=meeting_id, user=meeting.owner).values_list('start_time')
    owner_time_slots = [dt[0].strftime('%Y-%m-%d %H:%M:%S') for dt in owner_time_slots]

    user_processed, time_processed = set(), set()

    for slot in slots:
        if slot["user"] not in invitees:
            return Response({"error": f"Participant {slot['user']} was not invited to the meeting."},
                            status=status.HTTP_403_FORBIDDEN)
        if slot["user"] in user_processed:
            return Response({"error": f"Duplicate users."},
                            status=status.HTTP_403_FORBIDDEN)

        participant_time_slots = TimeSlot.objects.filter(meeting_id=meeting_id, user_id=slot["user"]).values_list('start_time')
        participant_time_slots = [dt[0].strftime('%Y-%m-%d %H:%M:%S') for dt in participant_time_slots]

        if slot["time"] not in owner_time_slots or slot["time"] not in participant_time_slots:
            print(owner_time_slots)
            print(participant_time_slots)
            return Response({"error": f"Participant {slot['user']}'s time was not an available time slot."},
                            status=status.HTTP_403_FORBIDDEN)

        if slot["time"] in time_processed:
            return Response({"error": f"Duplicate time slots."},
                            status=status.HTTP_403_FORBIDDEN)
        user_processed.add(slot["user"])
        time_processed.add(slot["time"])
        invitees_check_remaining.remove(slot["user"])
    for left_over in left_overs:
        if left_over["user"] not in invitees:
            return Response({"error": f"Participant {left_over['user']} was not invited to the meeting."},
                            status=status.HTTP_403_FORBIDDEN)
        if left_over["user"] in user_processed:
            return Response({"error": "Duplicate users."},
                            status=status.HTTP_403_FORBIDDEN)
        user_processed.add(left_over["user"])
        invitees_check_remaining.remove(left_over["user"])

    if len(invitees_check_remaining) != 0:
        return Response({"error": f"Some invitees are not handled."},
                        status=status.HTTP_403_FORBIDDEN)

    email_sent = 0
    reply_to = [meeting.owner.email]
    subject = "Meeting Confirmation"

    for slot in slots:
        participant = User.objects.get(pk=slot["user"])
        FinalizedMeeting.objects.create(
            title=meeting.title,
            time=slot["time"],
            time_limit = meeting.time_limit,
            owner = meeting.owner,
            participant = participant
        )
        message = (f"{meeting.owner.first_name} {meeting.owner.last_name} has confirmed your meeting time.\n"
                   f"Meeting Title: {meeting.title} \n"
                   f"Meeting Time: {slot['time']} \n"
                   f"Meeting Duration: {meeting.time_limit} minutes \n"
                   f"Meeting Message: {meeting.message}"
                   )
        email_sent += send_email(subject, message, [User.objects.get(pk=slot["user"]).email], reply_to)

        expire_time = datetime.strptime(slot["time"], '%Y-%m-%d %H:%M:%S')
        Notification.objects.create(
            owner=meeting.owner,
            title = "Meeting Reminder: " + meeting.title,
            content = f"Your meeting with {participant.first_name} {participant.last_name} on {expire_time} is about to start",
            show_time = expire_time - timedelta(minutes=30),
            expire_time = expire_time,
            is_seen = False,
        )
        Notification.objects.create(
            owner=participant,
            title = "Meeting Reminder: " + meeting.title,
            content = f"Your meeting with {meeting.owner.first_name} {meeting.owner.last_name} on {expire_time} is about to start",
            show_time = expire_time - timedelta(minutes=30),
            expire_time = expire_time,
            is_seen = False,
        )

    subject = "Meeting Cancellation"
    for left_over in left_overs:
        message = (f"{meeting.owner.first_name} {meeting.owner.last_name} has not confirmed your meeting time.\n"
                   f"Meeting Title: {meeting.title} \n"
                   f"Meeting Message: {meeting.message}"
                   )
        email_sent += send_email(subject, message, [User.objects.get(pk=left_over["user"]).email], reply_to)

    if email_sent > 0:
        email_message = f"{email_sent} emails are sent successfully."
    else:
        email_message = "Failed to send email."

    meeting.delete()

    return Response({"message": "Meeting successfully Finalized. " + email_message}, status=status.HTTP_201_CREATED)

@extend_schema(
    summary='Get Suggested Schedule for a meeting',
    description="Retrieve a meeting's suggested schedule by the meeting id",
    responses={
        200: inline_serializer(
            name='SuggestedSchedule',
            fields={
                'suggested_meetings': serializers.ListField(
                    child=inline_serializer(
                        name='suggested_meeting',
                        fields={
                            "priority": serializers.CharField(),
                            "n_scheduled": serializers.IntegerField(),
                            'slots': serializers.ListField(
                                child=inline_serializer(
                                    name='TimeSLot',
                                    fields={
                                        "user": serializers.IntegerField(),
                                        "time": serializers.DateTimeField(),
                                    }
                                )
                            ),
                            'leftovers': serializers.ListField(
                                child=inline_serializer(
                                    name='Leftover',
                                    fields={
                                        "user": serializers.IntegerField(),
                                    }
                                )
                            )
                        }
                    )
                )
            }
        ),
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_suggested_meetings(request, meeting_id):
    try:
        meeting = PendingMeeting.objects.get(pk=meeting_id)
        if request.user != meeting.owner:
            return Response({"error": "You do not have permission to view this meeting."},
                            status=status.HTTP_403_FORBIDDEN)
    except PendingMeeting.DoesNotExist:
        return Response({"error": "Meeting not found"}, status=status.HTTP_404_NOT_FOUND)

    suggested_schedules = SuggestedSchedule.objects.filter(meeting_id=meeting_id)
    if len(suggested_schedules) != 0:
        response_data = []
        for schedule in suggested_schedules:
            time_slots = SuggestedTimeSlot.objects.filter(meeting=schedule).select_related('user')

            slots_data = [
                {"user": slot.user.pk, "time": slot.time.strftime("%Y-%m-%d %H:%M:%S")}
                for slot in time_slots if slot.time is not None
            ]
            left_overs = [
                {"user": slot.user.pk}
                for slot in time_slots if slot.time is None
            ]
            response_data.append({
                "priority": schedule.priority.name,
                "n_scheduled": schedule.n_scheduled,
                "slots": slots_data,
                "leftovers": left_overs
            })
        return Response({"suggested_meetings": response_data})
    else:
        time_slots = TimeSlot.objects.filter(meeting_id=meeting_id, user_id=meeting.owner_id)
        slots = []
        for time_slot in time_slots:
            slots.append((time_slot.start_time.strftime("%Y-%m-%d %H:%M:%S"), time_slot.priority))

        responses = []
        positive_respondents = Participant.objects.filter(meeting_id=meeting_id, response=True).order_by('response_time')
        for participant in positive_respondents:
            available = set()
            prioritized = set()
            time_slots = TimeSlot.objects.filter(meeting_id=meeting_id, user=participant.user)
            time_slots = [
                (slot.start_time.strftime("%Y-%m-%d %H:%M:%S"), slot.priority)
                for slot in time_slots
            ]
            for time, priority in time_slots:
                index = next((index for index, (first, _) in enumerate(slots) if first == time), None)
                if index is None:
                    return Response({"error": f"Time slot {time} for {participant.user.pk} not found"},
                                    status=status.HTTP_404_NOT_FOUND)
                if priority == 1:
                    prioritized.add(index)
                else:
                    available.add(index)
            responses.append((participant.user.pk, available, prioritized))

        response_data = []
        for priority in [Priority.INVITEE_ORDER, Priority.INVITEE_PRIORITIES]:
            n_scheduled, matching, leftovers = suggest_schedule(slots, responses, priority)
            suggested_schedule = SuggestedSchedule.objects.create(
                meeting=meeting,
                priority=priority,
                n_scheduled=n_scheduled
            )
            for invitee in matching:
                SuggestedTimeSlot.objects.create(
                    meeting=suggested_schedule,
                    time=matching[invitee],
                    user=User.objects.get(id=invitee)
                )
            slots_data = [
                {"user": invitee,
                 "time": matching[invitee]}
                for invitee in matching
            ]
            for invitee in leftovers:
                SuggestedTimeSlot.objects.create(
                    meeting=suggested_schedule,
                    time=None,
                    user=User.objects.get(id=invitee)
                )
            left_overs = [
                {"user": invitee}
                for invitee in leftovers
            ]
            response_data.append({
                "priority": priority.name,
                "n_scheduled": n_scheduled,
                "slots": slots_data,
                "leftovers": left_overs
            })
        return Response({"suggested_meetings": response_data})

@extend_schema(
    summary="Send Email",
    description="Send a email to recipient",
    request={
        "application/json": {
            "example": {
                "subject": "Subject of the email",
                "content": "Content of the email",
                "recipient_email": "recipient@example.com",
                "sender_email": "sender@example.com",
            }
        }
    },
    responses={
        200: inline_serializer(
            name='Message',
            fields={
                'message': serializers.CharField(),
            }
        ),
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Adjust or remove based on your authentication needs
def send_email_view(request):
    # Extract email data from the request
    subject = request.data.get('subject')
    message = request.data.get('content')  # Use 'message' or 'content' based on your front-end
    recipient_email = request.data.get('recipient_email')
    reply_to = [request.data.get('reply_to', 'no-reply309@outlook.com')]

    # Ensure all required fields are provided
    if not all([subject, message, recipient_email]):
        return Response({'error': 'Missing required fields.'}, status=status.HTTP_400_BAD_REQUEST)

    # Send the email
    recipient_list = [recipient_email]  # EmailMessage expects a list of recipients
    count = send_email(subject, message, recipient_list, reply_to)

    if count:
        return Response({'message': 'Email sent successfully.'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Failed to send email.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)