//sfc stateless function
import React, { useContext, useEffect, useState } from "react";

const Home = () => {
  const [time, setTime] = useState("");
  const showTime = () => {
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    var s = date.getSeconds(); // 0 - 59
    var session = "AM";

    if (h == 0) {
      h = 12;
    }

    if (h > 12) {
      h = h - 12;
      session = "PM";
    }

    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;

    var time = h + ":" + m + ":" + s + " " + session;

    setTime(time);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      showTime();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container-fluid ">
      <div className="row">
        <h1> Home page</h1>
      </div>
      <div className="row m-5">
        <div class="col-md-10 ">
          <div class="row ">
            <div class="col-xl-3 col-lg-6">
              <div class="card l-bg-cherry">
                <div class="card-statistic-3 p-4">
                  <div class="card-icon card-icon-large">
                    <i class="fas fa-users"></i>
                  </div>
                  <div class="mb-4">
                    <h5 class="card-title mb-0">Case</h5>
                  </div>
                  <div class="row align-items-center mb-2 d-flex">
                    <div class="col-8"></div>
                    <div class="col-4 text-right">
                      <span>
                        10 <i class="fa fa-arrow-up"></i>
                      </span>
                    </div>
                  </div>
                  <div
                    class="progress mt-1 "
                    data-height="8"
                    style={{ height: "8px" }}
                  >
                    <div
                      class="progress-bar l-bg-cyan"
                      role="progressbar"
                      data-width="25%"
                      aria-valuenow="25"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{ width: "25%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xl-3 col-lg-6">
              <div class="card l-bg-blue-dark">
                <div class="card-statistic-3 p-4">
                  <div class="card-icon card-icon-large">
                    <i class=""></i>
                  </div>
                  <div class="mb-4">
                    <h5 class="card-title mb-0">Case reseloved</h5>
                  </div>
                  <div class="row align-items-center mb-2 d-flex">
                    <div class="col-8">
                      <h2 class="d-flex align-items-center mb-0">15.07k</h2>
                    </div>
                    <div class="col-4 text-right">
                      <span>
                        9.23% <i class="fa fa-arrow-up"></i>
                      </span>
                    </div>
                  </div>
                  <div
                    class="progress mt-1 "
                    data-height="8"
                    style={{ height: "8px" }}
                  >
                    <div
                      class="progress-bar l-bg-green"
                      role="progressbar"
                      data-width="25%"
                      aria-valuenow="25"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{ width: "25%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xl-3 col-lg-6">
              <div class="card l-bg-green-dark">
                <div class="card-statistic-3 p-4">
                  <div class="card-icon card-icon-large">
                    <i class="fas fa-ticket-alt"></i>
                  </div>
                  <div class="mb-4">
                    <h5 class="card-title mb-0">Ticket Resolved</h5>
                  </div>
                  <div class="row align-items-center mb-2 d-flex">
                    <div class="col-8">
                      <h2 class="d-flex align-items-center mb-0">578</h2>
                    </div>
                    <div class="col-4 text-right">
                      <span>
                        10% <i class="fa fa-arrow-up"></i>
                      </span>
                    </div>
                  </div>
                  <div
                    class="progress mt-1 "
                    data-height="8"
                    style={{ height: "8px" }}
                  >
                    <div
                      class="progress-bar l-bg-orange"
                      role="progressbar"
                      data-width="25%"
                      aria-valuenow="25"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{ width: "25%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xl-3 col-lg-6">
              <div class="card l-bg-orange-dark">
                <div class="card-statistic-3 p-4">
                  <div class="card-icon card-icon-large">
                    <i class="fas fa-dollar-sign"></i>
                  </div>
                  <div class="mb-4">
                    <h5 class="card-title mb-0">Card Clock</h5>
                  </div>
                  <div class="row align-items-center mb-2 d-flex">
                    <div class="col-8">
                      <h2 class="d-flex align-items-center mb-0">{time}</h2>
                    </div>
                    <div class="col-4 text-right"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
