from django.urls import path
from .views import create_user_view, profile_edit_view, get_active_notifications, get_notification_by_id, \
    list_contacts_view, add_contact_view, create_group_view, list_groups_view, view_group, delete_group, remove_member, \
    add_member, change_group_name, delete_contact_view, get_contact_view


urlpatterns = [
    path('register/', create_user_view, name='register'),
    path('profile/', profile_edit_view, name='profile'),
    path('notifications/', get_active_notifications, name='active_notifications'),
    path('notifications/<int:notification_id>/', get_notification_by_id, name='notification-by-id'),
    path('contacts/', list_contacts_view, name='list-contacts'),
    path('contacts/add/', add_contact_view, name='add-contact'),
    path('contacts/delete/<int:contact_id>/', delete_contact_view, name='delete-contact'),
    path('contacts/<int:contact_id>/', get_contact_view, name='get-contact'),
    path('group/create/', create_group_view, name='create-group'),
    path('group/', list_groups_view, name='list-groups'),
    path('group/<int:group_id>/', view_group, name='view-group'),
    path('group/<int:group_id>/delete/', delete_group, name='delete-group'),
    path('group/<int:group_id>/remove/<str:username>/', remove_member, name='remove-member'),
    path('group/<int:group_id>/add/<str:username>/', add_member, name='add-member'),
    path('group/<int:group_id>/change-name/', change_group_name, name='change-group-name'),
]