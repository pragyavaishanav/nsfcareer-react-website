import React from 'react';
import { InView } from 'react-intersection-observer';

class ResearchArea extends React.Component {
  render() {
    const resetHeight = {
      height: 'auto'
    };

    return (
      <div className="section-three-container">
        <div
          id="ptf-sol-laptop"
          className={`research-area-bg ${
            this.props.screenWidth >= 1024 ? 'ptf-laptop' : ''
          }`}
          style={this.props.screenWidth < 725 ? resetHeight : {}}
        >
          <div className="container">
            <div className="section-three text-center py-5">
              <h1 className="font-weight-bold pt-5">RESEARCH AREAS</h1>
              <InView>
                {({ inView, ref, entry }) => (
                  <hr
                    ref={ref}
                    className={`animated ${inView ? 'zoomIn' : ''}`}
                  />
                )}
              </InView>
              <div className="row text-center center-card  ">
                <InView>
                  {({ inView, ref, entry }) => (
                    <div
                      ref={ref}
                      className={`col-md-6 col-lg-6 
                        ${this.props.screenWidth < 769 ? 'px-2 py-2' : 'px-5'}
                          ${inView ? 'animated slideInLeft' : ''}
                        `}
                    >
                      <div className="card mx-4 rounded-img">
                        <img
                          className="card-img-top"
                          src="/img/ResearchAreaImg/Group-2491.svg"
                          alt={''}
                        />
                        <div className="card-body">
                          <h5>For Soldiers</h5>
                          <p className="card-text px-4 mt-3 color">
                            We use sensor-enabled, cloud-based platform for
                            individualized brain modeling of <br /> Soldiers.
                            <a href=""> Read More</a>{' '}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </InView>
                <InView>
                  {({ inView, ref, entry }) => (
                    <div
                      ref={ref}
                      className={`col-md-6 col-lg-6 
                        ${this.props.screenWidth < 769 ? 'px-2 py-2' : 'px-5'}
                        ${inView ? 'animated slideInRight' : ''}
                          `}
                    >
                      <div className="card mx-4 rounded-img">
                        <img
                          className="card-img-top"
                          src="/img/ResearchAreaImg/Group-2492.svg"
                          alt={''}
                        />
                        <div className="card-body">
                          <h5>For Athletes</h5>
                          <p className="card-text px-4 mt-3 color">
                            We utilize data from the customized computer models
                            to approximate an Athlete's brain’s response to
                            injuries.
                            <a href=""> Read More</a>{' '}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </InView>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ResearchArea;
