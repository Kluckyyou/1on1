import React from 'react';

const MainContent = () => {
  return (
        <div class="col-md-10 main-content">
          <div class="row flex-nowrap mb-3">
            <div class="col-md-9 col-12 d-flex flex-column">
              <div class="big-box">
                <div class="calendar-header mb-3">
                  <h4 id="month-year">February 2024</h4>
                </div>
                <table class="calendar-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>12 Mon</th>
                      <th>13 Tue</th>
                      <th>14 Wed</th>
                      <th>15 Thu</th>
                      <th>16 Fri</th>
                      <th>17 Sat</th>
                      <th>18 Sun</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="time-cell" time="9 am">9 AM</td>
                      <td class="green-color">Meeting with Mario Badr</td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                    </tr>
                    <tr>
                      <td class="time-cell" time="9:30 am">9:30 AM</td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                    </tr>
                    <tr>
                      <td class="time-cell" time="10 am">10 AM</td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="blue-color" rowspan="2">
                        Meeting with Nisarg Shah
                      </td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                    </tr>
                    <tr>
                      <td class="time-cell" time="10:30 am">10:30 AM</td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                    </tr>
                    <tr>
                      <td class="time-cell" time="11 am">11 AM</td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="gold-color" rowspan="2">
                        Meeting with Eleanor Stratford
                      </td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                    </tr>
                    <tr>
                      <td class="time-cell" time="11:30 am">11:30 AM</td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                    </tr>
                    <tr>
                      <td class="time-cell" time="12 pm">12 PM</td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                    </tr>
                    <tr>
                      <td class="time-cell" time="12:30 pm">12:30 PM</td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                    </tr>
                    <tr>
                      <td class="time-cell" time="1 pm">1 PM</td>
                      <td class="e-cell"></td>
                      <td class="cyan-color">Meeting with Francois Pitt</td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                    </tr>
                    <tr>
                      <td class="time-cell" time="1:30 pm">1:30 PM</td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                    </tr>
                    <tr>
                      <td class="time-cell" time="2 pm">2 PM</td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                    </tr>
                    <tr>
                      <td class="time-cell" time="2:30 pm">2:30 PM</td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                    </tr>
                    <tr>
                      <td class="time-cell" time="3 pm">3 PM</td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                    </tr>
                    <tr>
                      <td class="time-cell" time="3:30 pm">3:30 PM</td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                    </tr>
                    <tr>
                      <td class="time-cell" time="4 pm">4 PM</td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                    </tr>
                    <tr>
                      <td class="time-cell" time="4:30 pm">4:30 PM</td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                    </tr>
                    <tr>
                      <td class="time-cell" time="5 pm">5 PM</td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                    </tr>
                    <tr>
                      <td class="time-cell" time="5:30 pm">5:30 PM</td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                    </tr>
                    <tr>
                      <td class="time-cell" time="6 pm">6 PM</td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                    </tr>
                    <tr>
                      <td class="time-cell" time="6:30 pm">6:30 PM</td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                    </tr>
                    <tr>
                      <td class="time-cell" time="7 pm">7 PM</td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="red-color" rowspan="2">
                        Meeting with Julian Wexler
                      </td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                    </tr>
                    <tr>
                      <td class="time-cell" time="7:30 pm">7:30 PM</td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                    </tr>
                    <tr>
                      <td class="time-cell" time="8 pm">8 PM</td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                    </tr>
                    <tr>
                      <td class="time-cell" time="8:30 pm">8:30 PM</td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                    </tr>
                    <tr>
                      <td class="time-cell" time="9 pm">9 PM</td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                      <td class="e-cell"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="col-md-3 d-flex flex-column">
              <div class="schedule h-100">
                <div class="schedule-title">Schedule</div>
                <div class="event-container">
                  <div class="event green-color" mb-3 mt-3>
                    Meeting with Mario Badr(Feb 12 9 AM) 30min
                  </div>
                  <div class="event cyan-color" mb-3 mt-3>
                    Meeting with Francois Pitt(Feb 13 1 PM) 30min
                  </div>
                  <div class="event blue-color" mb-3 mt-3>
                    Meeting with Nisarg Shah(Feb 14 10 AM) 60min
                  </div>
                  <div class="event gold-color" mb-3 mt-3>
                    Meeting with Eleanor Stratford(Feb 14 11 AM) 60min
                  </div>
                  <div class="event red-color" mb-3 mt-3>
                    Meeting with Julian Wexler(Feb 15 7PM) 60min
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="pending-meetings">
              <div class="row">
                <div class="col meeting gold-color" mb-3 mt-3>
                  <h5>Pending Meeting 1</h5>
                  <p class="ddl">Deadline: Jan 12 12:00</p>
                  <ul>
                    <li>Jack Sun: Responded</li>
                    <li>David Liu: Not Responded</li>
                  </ul>
                </div>
                <div class="col meeting cyan-color" mb-3 mt-3>
                  <h5>Pending Meeting 2</h5>
                  <p class="ddl">Deadline: Jan 12 12:00</p>
                  <ul>
                    <li>Emily Archer: Not Responded</li>
                    <li>Nathan Blackwood: Not Responded</li>
                  </ul>
                </div>
                <div class="col meeting green-color" mb-3 mt-3>
                  <h5>Pending Meeting 3</h5>
                  <p class="ddl">Deadline: Jan 12 12:00</p>
                  <ul>
                    <li>Isabella Cortez: Responded</li>
                    <li>Lucas Donovan: Responded</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
  );
};

export default MainContent;
