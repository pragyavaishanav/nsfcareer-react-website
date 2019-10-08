import React from 'react';
import { svgToInline } from '../../config/InlineSvgFromImg';
import CumulativeAccelerationEventChart from '../Charts/CumulativeAccelerationEventChart';
import CumulatieAccelerationToTimeEventChart from '../Charts/CumulatieAccelerationToTimeEventChart';

class CumulativeEventsAccelerationEvents extends React.Component {

  constructor(props) {
    super(props);
    console.log("Received in Props", props)
    this.state = {
        is_selfie_image_uploaded : props.is_selfie_image_uploaded,
        imageUrl : props.imageUrl
    };
  }


  componentDidMount() {
    svgToInline();
  }


  render() {
    return (
      <div className="row cumm mb-5 ">
        <div className="col-md-6 col-lg-7">
          <CumulativeAccelerationEventChart is_selfie_image_uploaded={this.state.is_selfie_image_uploaded}  imageUrl={this.state.imageUrl} data={this.props.data}/>
        </div>
        <div className="col-md-6 col-lg-5  ">
          <CumulatieAccelerationToTimeEventChart data={this.props.loadData}/>
        </div>
      </div>
    );
  }
}

export default CumulativeEventsAccelerationEvents;