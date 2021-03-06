import React from 'react';
import { Redirect, Link } from 'react-router-dom';
// import CumulativeEvents from '../../DashboardEventsChart/CumulativeEvents';
// import CumulativeEventsAccelerationEvents from '../../DashboardEventsChart/CumulativeEventsAccelerationEvents';
// import HeadAccelerationEvents from '../../DashboardEventsChart/HeadAccelerationEvents';
import { svgToInline } from '../../../config/InlineSvgFromImg';
import HeadLinearAccelerationAllEvents from '../../DashboardEventsChart/HeadLinearAccelerationAllEvents';
import HeadAngularAccelerationAllEvents from '../../DashboardEventsChart/HeadAngularAccelerationAllEvents';
import Dropzone from 'react-dropzone';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import Footer from '../../Footer';
import simulationLoading from '../../simulationLoading.png';
import videoSimulationLoading from './videoSimulationLoading.png';
import unlock from './unlock.png';
import lock from './lock.png';
import upload from './upload.png';
import remove from './remove.png';
import trim_icon from './trim_icon.png';
import reset_icon from './reset_icon.png';
import pause_b from '../../icons/pause_b.png';
import pause_bl from '../../icons/pause_bl.png';
import video_loop_b from '../../icons/video_loop_b.png';
import video_loop_bl from '../../icons/video_loop_bl.png';
import video_pause_b from '../../icons/video_pause_b.png';
import video_play_bl from '../../icons/video_play_bl.png';
import icon_download_white from '../../icons/icon_download_white.png';
import uploadicon from './upload-icon.png'
import 'jquery';
import '../../Buttons/Buttons.css';
import '.././Dashboard.css';
import {
  getUserDetails,
  getUserDBDetails,
  isAuthenticated,
  getBrainSimulationMovie,
  removeVideo,
  setVideoTime,
  getCumulativeAccelerationTimeRecords,
  getSimulationDetail,
  mergeVideos,
  trimVideo,
  resetToOriginal
} from '../../../apis';
import axios from 'axios';

import { ProgressBar } from 'react-bootstrap';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Spinner from '../../Spinner/Spinner';

import ScrollToTop from 'react-scroll-up';
import $ from 'jquery';

/**
*  Define global variables.
*/
let lock_time = 0;
let left_lock_time = 0;
let right_lock_time = 0;

let lock_percent = 0;
let called = false;
let lock_time_2 = 0;
let lock_percent_2 = 0;
let called_2 = false;
let called_3 = false;
let state_updated = false;
let min = 0;
let max = 100;

let _isFirstUpdate = '';
let _min = 0;
let _max = 100;
class Details extends React.Component {
  constructor(props) {
    super(props);
    this.onDrop = (files) => {
      if(files.length > 1){
        alert('You can upload only one file');
      }else{
        this.setState(files)
        this.upload(files[0]);
      }
    };
    this.state = {
      isAuthenticated: false,
      user: null,
      isCheckingAuth: true,
      linearUnit: 'gs',
      linearUnitGsActive: true,
      linearUnitMsActive: false,
      cumulativeEventData: {},
      movie_link: '',
      files: [],
      status: '',
      impact_video_url: '',
      trim_video_url: '',
      simulation_log_path: '',
      simulation_log:'',
      uploadPercentage: 0,
      IsAcceleration: false,
      label_remove_video: 'Remove',
      video_time: 0,
      video_time_2: 0,
      video_time_3: 0,
      video_lock_time: false,
      video_lock_time_2:false,
      left_lock_time: 0,
      right_lock_time: 0,
      isTimeUpdating: false,
      isTimeUpdating_2: false,
      image_id: this.props.match.params.image_id,
      player_id: this.props.match.params.player_id,
      cognito_user_id: this.props.match.params.cognito_user_id,
      simulation_data: '',
      simulationData: '',
      lock_video_3: false,
      isCommonControl: false,
      controlPlayVideo: false,
      isRepeatVideo: false,
      value: { min: 0, max: 100 },
      SidelineVidoeCT: '',
      simulationStatus: 'pending',
      label_resetVideo: 'Reset',
      label_TrimVideo: 'Trim',

      isTriming: false,
      account_id: '',
      simulation_id: '',
      isLoading: true
    };
  }
 
  getUploadFileExtension3(url){
    if(new RegExp(".mp4").test(url)){
        return ".mp4";
    }
    if(new RegExp(".mov").test(url)){
        return ".mov";
    }
    if(new RegExp(".3gp").test(url)){
        return ".3gp";
    }
    if(new RegExp(".ogg").test(url)){
        return ".ogg";
    }
    if(new RegExp(".wmv").test(url)){
        return ".wmv";
    }
    if(new RegExp(".webm").test(url)){
        return ".webm";
    }
    if(new RegExp(".flv").test(url)){
        return ".flv";
    }
    if(new RegExp(".TIFF").test(url)){
        return ".TIFF";
    }
  }
  componentDidUpdate() {
    svgToInline();
  }

  uploadFile = (event) =>{
    this.setState({impact_video_url: ''});
    this.upload(event.target.files[0]);
  }
  handalRemoveVideo = () =>{
     this.setState({
      label_remove_video: 'Removing...',
      isLoading: false
    })
    removeVideo({'image_id':this.state.image_id})
    .then(res => {
      if(res.data.message === 'success'){
        this.setState({
          label_remove_video: 'Removed',
          left_lock_time: 0,
          right_lock_time: 0,
          trim_video_url: '',
        })
        var the = this;
        setTimeout(function(){
          the.setState({impact_video_url: ''})
          the.vidocontrol3()
        },2000);
      }else{
        alert(res.data.err);
      }
    }).catch(err =>{
      console.log(err)
    })
  }

  upload =(file)=>{
    const data = new FormData() 
    data.append('file',file);
    data.append('image_id',this.state.image_id );
    this.setState({isLoading:true,IsAcceleration:true})
    // var myVar = '';
    var the = this;
    const options = {
      onUploadProgress: (progressEvent) => {
        const {loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        if(percent < 70){
          this.setState({uploadPercentage:percent})
        }else{
          setInterval(function(){
            if(the.state.uploadPercentage < 99){
              the.setState({uploadPercentage: the.state.uploadPercentage + 1});
            }
          }, 2000);
        }
      }
    }
    axios.post(`/uploadSidelineImpactVideo`, data,options,{withCredentials: true})
    .then(function (res) {
      if(res.data.message === 'success'){
        the.setState({uploadPercentage:100});
        setTimeout(function(){
          the.setState({impact_video_url: res.data.impact_video_url, left_lock_time: 0,right_lock_time: 0, trim_video_url: ''});
        },2000);
        setTimeout(()=>{the.vidocontrol3()},4000);
        setTimeout(()=>{the.vidocontrol()},2000);
      }else{
        the.setState({status: res.data.data.message});
      }
    })
    .catch(function (error) {
      console.log(error)
    });
  }

  gotoTop = () => {
    window.scrollTo({ top: '0', behavior: 'smooth' });
  };
  setRangeValue =(value) =>{
    if(_isFirstUpdate === ''){
      _isFirstUpdate = true;
      _min = value.min;
      _max = value.max;
      if(min !== value.min && !this.state.left_lock_time){
        console.log('updating min =',value.min , min ,'max value = ',value.max , max );
        this.setState({value :  {min:   value.min , max: max } })
      } 
      if(max !== value.max && !this.state.right_lock_time){
        console.log('updating max =',value.max , max , 'min value = ', value.min , min)

        this.setState({value :  {min:   min , max: value.max } })
      }
    }else{
      console.log('not fist update');
      if(_min !== value.min && !this.state.left_lock_time){
        _min = value.min
        console.log('updating min =',value.min , _min ,'max value = ',value.max , _max );
        this.setState({value :  {min:   value.min , max: _max } })
      } 
      if(_max !== value.max && !this.state.right_lock_time){
        _max = value.max;
        console.log('updating max =',value.max , _max , 'min value = ', value.min , _min)

        this.setState({value :  {min:   _min , max: value.max } })
      }
    }
  }

  handleChangeRange =(event)=>{
    this.setState({video_time: event.target.value});
  }

  getVideoTime=(time)=>{
    var whereYouAt = time;
    var minutes = Math.floor(whereYouAt / 60);   
    var seconds = Math.floor(whereYouAt - minutes * 60)
    var x = minutes < 10 ? "0" + minutes : minutes;
    var y = seconds < 10 ? "0" + seconds : seconds;
    if(minutes > 0 ){
      return x+':'+y+' min.';
    }else{
      return x+':'+y+' sec.';
    }
  }

  vidocontrol =()=>{
    const player = document.querySelector('.player');
    const video = player.querySelector('.viewer');
    
    // const progressBar = document.querySelector('.progress__filled');
    const lockButton = document.querySelector('.lock_video');

    const progressBar_2 = document.querySelector('.input-range');
    
    var isupdateMax =  false;
    right_lock_time = video.duration;

    let the = this;
    video.onplay = ('play', function(e){
      video.play();
    });
    let len = 0;
    const setVideoFrameRate = (leftTime, rightTime) =>{
      console.log(leftTime, rightTime);
      var total_video_duration = rightTime - leftTime;
      var frameRate = Math.floor(total_video_duration*29.7);
      total_video_duration = the.getVideoTime(total_video_duration);
      the.setState({framesofSidelineVideo: frameRate, lengthofSidelineVideo: total_video_duration})

    }
    let controls = {
      //Updating scroller to video time
       handleProgress:  ()=> {
        const percent = (video.currentTime / video.duration) * 100;
        
        lock_percent = percent;
        lock_time = video.currentTime;

        /*============== If Video max value updateing======================*/
        if(isupdateMax){
          max = percent.toFixed(0);

          //*---------Set max slider position greater then min slider-----------*
          if(max > the.state.value['min'] && lock_percent > 1 && !the.state.right_lock_time){
            the.setState({video_time: percent,value:{ max: percent.toFixed(0), min: the.state.value['min'] }});
            right_lock_time = video.currentTime;
            //Update fram rate and video lenght...
            setVideoFrameRate(left_lock_time,right_lock_time);
          }else{
            video.pause();
            video.currentTime = left_lock_time;
            isupdateMax = false;
          }
        }
        /*================If slider min value updating======================*/
        else if(!isupdateMax){
          
          if(min < the.state.value['max']){
          // video.play();
            //--------Set min slider position if video is unlock.----------
            if(len !== 0 && !the.state.left_lock_time){
              the.setState({video_time: percent,value:{ min: percent.toFixed(0), max: the.state.value['max'] }});
              min = percent.toFixed(0);
              left_lock_time = video.currentTime;

              //Update fram rate and video lenght...
              setVideoFrameRate(left_lock_time,the.state.right_lock_time ? the.state.right_lock_time : right_lock_time);
            }
            //-----set min slider position if video is locked --------
            else if(len === 0){
              the.setState({video_time: percent,value:{ min: percent.toFixed(0), max: the.state.value['max'] }});
              min = percent.toFixed(0);
              left_lock_time = video.currentTime;
            }
            //-----------Set green slider position if video is locked -------------
            else{
              if(percent > the.state.value['min'] && percent <  the.state.value['max']){
                the.setState({video_time: percent})
              }else{
                video.pause();
                video.currentTime = the.state.left_lock_time || 0;
                the.setState({video_time: percent})

              }
            }
          }else{
            min = percent.toFixed(0);
            video.pause();
            video.currentTime = the.state.left_lock_time || 0;
          }
          len++;
        }else{
          video.pause();
        }
      },
      scrub: (e) =>{
        // const scrubTime = (e.offsetX / progressBar.offsetWidth) * video.duration;
        // var time = scrubTime;
        
        // var val = e.target.value - 4;
        // var val2 = parseInt(e.target.value) + 1;

        //   console.log( val2 , the.state.value['min'])

        // if(scrubTime && val  < the.state.value['max'] &&  val2 > the.state.value['min'] ){
        //   the.setState({SidelineVidoeCT : the.getVideoTime(time)});
        //   video.currentTime = scrubTime;
        // }else{
        //   the.setState({video_time:  the.state.value['min']});          
        // }
        // setTimeout(()=>{
        //   the.setState({SidelineVidoeCT : ''})
        // },1000)
      },
      scrub2: (e) =>{
        if(min !== the.state.value['min'] && !the.state.left_lock_time){

          min = the.state.value['min'];
          var off_X = progressBar_2.offsetWidth * the.state.value['min'] / 100;
          const scrubTime = (off_X / progressBar_2.offsetWidth) * video.duration;
          console.log('updating min', scrubTime);

          if(scrubTime && !the.state.video_lock_time){
            video.currentTime = scrubTime;
          }
          isupdateMax = false;
        }else if(max !== the.state.value['max'] &&  !the.state.right_lock_time){
          max = the.state.value['max'];
          // eslint-disable-next-line
          var off_X = progressBar_2.offsetWidth * the.state.value['max'] / 100;
          const scrubTime = (off_X / progressBar_2.offsetWidth) * video.duration;
          console.log('updating max', scrubTime);

          if(scrubTime && !the.state.video_lock_time){
            video.currentTime = scrubTime;
          }
          isupdateMax = true;
        }
        
      },
      lockVideo:()=>{
        lock_time = video.currentTime;
        const percent2 = (video.currentTime / video.duration) * 100;
        lock_percent = percent2;
      },
      setvideoTime:()=>{
        console.log('setting lock time')
        video.currentTime = the.state.left_lock_time || 0; 
        let total_video_duration = 0;
        let frameRate = 0;
        if(the.state.right_lock_time > 0){
          const percent2 = (the.state.right_lock_time / video.duration) * 100;
          max = percent2;
          $('.input-range__slider').eq(1).css({'pointer-events': 'none'});
          the.setState({value: {min: the.state.left_lock_time ? the.state.left_lock_time : 0 , max: percent2 ? percent2.toFixed(0) : 100 }});

          /*
          * Set Cropped video duration and fram rate...
          */
          total_video_duration = the.state.left_lock_time ? the.state.right_lock_time - the.state.left_lock_time : the.state.right_lock_time;
          frameRate = Math.floor(total_video_duration*29.7);
          total_video_duration =  the.getVideoTime(total_video_duration);
        }else{
          frameRate = Math.floor(video.duration*29.7);
          total_video_duration = the.getVideoTime( video.duration);
          right_lock_time = video.duration;
          the.setState({value: {min: the.state.left_lock_time ? the.state.left_lock_time : 0 , max: 100 }});
          if(the.state.left_lock_time){
            $('.input-range__slider').eq(0).css({'pointer-events': 'none'});
            /*
            * Set Cropped video duration fram rate...
            */
            total_video_duration = video.duration - the.state.left_lock_time ;
            frameRate = Math.floor(total_video_duration*29.7);
            total_video_duration = the.getVideoTime(total_video_duration);
          }else{
            $('.input-range__slider').eq(0).css({'pointer-events': 'inherit'});
          }
          $('.input-range__slider').eq(1).css({'pointer-events': 'inherit'});
        }

        //Get video frames
        
        the.setState({framesofSidelineVideo: frameRate, lengthofSidelineVideo: total_video_duration})
      }
    }
    
    video.addEventListener('timeupdate', controls.handleProgress);
    video.addEventListener('loadeddata',()=> {setTimeout(()=>{
      controls.setvideoTime();
    },2000)} );

    // progressBar.addEventListener('click', controls.scrub);
    progressBar_2.addEventListener('click', (e) => controls.scrub2(e));

    lockButton.addEventListener('click', controls.lockVideo);
    let mousedown = false;
    progressBar_2.addEventListener('mousemove', (e) => mousedown && controls.scrub2(e));
    progressBar_2.addEventListener('mousedown', () => mousedown = true);
    progressBar_2.addEventListener('mouseup', () => mousedown = false);

    //... for green slider events 
    // let mousedown2 = false;
  }

  vidocontrol2 =()=>{
    const player = document.querySelector('.Simulationvideo');
    const video = player.querySelector('.viewer_2');
    
    const progressBar = document.querySelector('.progress__filled_2');
    const lockButton = document.querySelector('.lock_video_2');


    let the = this;
    let controls = {
      //Updating scroller to video time
      handleProgress:  ()=> {
        const percent = (video.currentTime / video.duration) * 100;
        $('.progress__filled_2').val(percent);
       
        lock_percent_2 = percent;
        lock_time_2 = video.currentTime;
        the.setState({video_time_2: percent});

      },
      scrub: (e) =>{
        const scrubTime = (e.offsetX / progressBar.offsetWidth) * video.duration;
        if(scrubTime && !the.state.video_lock_time_2){
          video.currentTime = scrubTime;
        }
      },
      lockVideo:()=>{
        console.log('clicked');
        lock_time_2 = video.currentTime;
        const percent2 = (video.currentTime / video.duration) * 100;
        lock_percent_2 = percent2;
        setTimeout(()=>{$('.progress__filled_2').val(percent2)},1000);
        
      },
      setvideoTime:(time)=>{
        console.log('time',time)
        video.currentTime = time

      },
      Onload:()=>{
        setTimeout(()=>{
          var frameRate = Math.floor(video.duration*29.7);
          the.setState({framesofSimulationVideo: frameRate})
          the.setState({lengthofSimulationVideo: the.getVideoTime(video.duration)})
        },1000)
      }
    }
    if(video && this.state.video_lock_time_2){
      controls.setvideoTime(this.state.video_lock_time_2);
    }
    //controls ....
    
    video.addEventListener('loadeddata', ()=> {setTimeout(()=>{
      controls.Onload();
    },2000)} );
    video.addEventListener('timeupdate', controls.handleProgress);
    progressBar.addEventListener('click', controls.scrub);
    lockButton.addEventListener('click', controls.lockVideo);
    let mousedown = false;
    progressBar.addEventListener('mousemove', (e) => mousedown && controls.scrub(e));
    progressBar.addEventListener('mousedown', () => mousedown = true);
    progressBar.addEventListener('mouseup', () => mousedown = false);
  }

  /*====================================
    Video controls of both movies start
  ========================================*/
  vidocontrol3=()=>{
    //Player 1 controls ...
    let video_1 = '';
    let video_2 = '';

    const player_1 = document.querySelector('.player');
    if(player_1){
        video_1 = player_1.querySelector('.viewer');
    }
    
    //player 2 controls ....
    const player_2 = document.querySelector('.Simulationvideo');
    if(player_2){
       video_2 = player_2.querySelector('.viewer_2');
    }
    
    let the = this;

    const custom_controls = { 
      play:()=>{
        console.log('play');
        if(the.state.controlPlayVideo){
          if(video_1) video_1.pause();
          if(video_2) video_2.pause();

          the.setState({controlPlayVideo: false});
        }else{
          if(video_1) video_1.play();
          if(video_2) video_2.play();

          the.setState({controlPlayVideo: true, controlPouseVideo: false});
        }
      },
      pause:()=>{
        if(video_1) video_1.pause();
        if(video_2) video_2.pause();
        the.setState({controlPlayVideo: false, controlPouseVideo : true});
      },
      repeatVideo:()=>{

        the.setState({isRepeatVideo: the.state.isRepeatVideo ? false : true });
      },
    }
    //Video play controll button .......... 
    const control_play_video = document.querySelector('.control_play_video');
    const control_pouse_video = document.querySelector('.control_pouse_video');
    const control_loop_video = document.querySelector('.control_loop_video');

    //controls .......
    control_play_video.addEventListener('click', custom_controls.play);
    control_pouse_video.addEventListener('click', custom_controls.pause);
    control_loop_video.addEventListener('click', custom_controls.repeatVideo);


    if(this.state.impact_video_url && this.state.movie_link){
      this.setState({isCommonControl: true});
      if(this.state.video_lock_time && this.state.video_lock_time_2){
        this.setState({lock_video_3: true});
      }
      
      //Comman progress bar ...
      const progressBar = document.querySelector('.progress__filled_3');
      // const lockButton = document.querySelector('.lock_video_3');
      let video_duration_1 = video_1.duration;
      let video_duration_2 = video_2.duration;
      console.log('videos \n',video_1,video_2)
      let controls = {
       
        scrub: (e) =>{
          let scrubTime = 0;
         
          video_1.pause();
          video_2.pause();
          if(video_duration_1 > video_duration_2){
            scrubTime = (e.offsetX / progressBar.offsetWidth) * video_duration_1;
          }else{
            scrubTime = (e.offsetX / progressBar.offsetWidth) * video_duration_2;
          }
         
          if(video_duration_1 >= scrubTime) video_1.currentTime = scrubTime;
          if(video_duration_2 >= scrubTime) video_2.currentTime = scrubTime;
          // lock_time = video_1.currentTime;
          // lock_time_2 = video_2.currentTime;
           console.log(video_duration_1 , video_duration_2);
          // const scrubTime = (e.offsetX / progressBar.offsetWidth) * video.duration;
          // if(scrubTime && !the.state.video_lock_time_2){
          //   video.currentTime = scrubTime;
          // }
        }
      }

      progressBar.addEventListener('click', controls.scrub);
      let mousedown = false;
      progressBar.addEventListener('mousemove', (e) => mousedown && controls.scrub(e));
      progressBar.addEventListener('mousedown', () => mousedown = true);
      progressBar.addEventListener('mouseup', () => mousedown = false);
    }else{
      this.setState({isCommonControl: false , lock_video_3: false});
    }
  }
  /*====================================
    Video controls of both movies end
  ========================================*/
  handlelock_video =(type)=>{
    console.log('type',type)
    if(type === 'left')
    {
      if(this.state.left_lock_time){
        this.setState({left_lock_time: 0});
        this.setVideoTime(0, this.state.right_lock_time);
      }else{
        this.setVideoTime(left_lock_time , this.state.right_lock_time);
      }
    }else{
      if(this.state.right_lock_time){
        this.setState({right_lock_time: false});
        this.setVideoTime(this.state.left_lock_time, 0);
      }else{
        this.setVideoTime(this.state.left_lock_time , right_lock_time);
      }
    }
    
    
  }


  handlelock_video_2=()=>{
    console.log('lock_time',lock_time_2)
    if(this.state.video_lock_time_2){
      this.setState({video_lock_time_2: 0});
      this.setVideoTime_2(0);
    }else{
      this.setState({video_lock_time_2: lock_time_2});
      this.setVideoTime_2(lock_time_2);
    }
    
  }
  handlelock_video_3 = ()=>{
    if(this.state.video_lock_time && this.state.video_lock_time_2){
      this.setState({video_lock_time: 0 ,video_lock_time_2: 0});
      this.setVideoTime(0);
      this.setVideoTime_2(0);
    }else{
      this.setState({video_lock_time: lock_time,video_lock_time_2: lock_time_2});
      console.log(lock_time, lock_time_2)
      this.setVideoTime(lock_time);
      this.setVideoTime_2(lock_time_2);
    }
  }

  /*
  * Video trim function start...
  */

  getVideoTime2=(time)=>{
    var whereYouAt = time;
    var minutes = Math.floor(whereYouAt / 60);   
    var seconds = Math.floor(whereYouAt - minutes * 60)
    var milseconds = Math.floor(whereYouAt - seconds * 60)

    var x = minutes < 10 ? "0" + minutes : minutes;
    var y = seconds < 10 ? "0" + seconds : seconds;
    var z = milseconds < 10 ? "0" + milseconds : milseconds;

    if(minutes > 0 ){
      return x+':'+y+':'+z;
    }else{
      return x+':'+y+':'+z;
    }
  }

  trimVideo=()=>{
    this.setState({isTriming: true})
    trimVideo({image_id:this.state.image_id, impact_video_url: this.state.impact_video_url, startTime: left_lock_time, endTime: right_lock_time})
    .then(response=>{
      console.log('response trim video ---\n',response);
      if(response.data.message === "success"){
        this.setState({
          trim_video_url: response.data.trim_video_path,
          left_lock_time: 0,
          right_lock_time: 0,
          isTriming: false,
          label_TrimVideo:'Success'
        })
        var the = this;
        setTimeout(()=>{
          the.setState({
            label_TrimVideo: 'Trim',
          })
        },2000)
      }else{
        this.setState({
          isTriming: false,
          label_TrimVideo: 'Failed'
        })
      }
    }).catch(err=>{
      console.log('triming err -------\n',err)
      this.setState({
        label_TrimVideo: 'Failed',
        isTriming: false
      })

    })


  }

  /*
  * Reset trim video to original...
  */
  resetToOriginal=()=>{
    this.setState({
      label_resetVideo: 'Reseting...'
    })
    resetToOriginal({image_id:this.state.image_id})
    .then(res=>{
      this.setState({
        label_resetVideo: 'Success',
        trim_video_url: '',
        left_lock_time: 0,
        right_lock_time: 0,
      })
      console.log('res',res);
      var the = this;
      setTimeout(()=>{
        the.setState({
          label_resetVideo: 'Reset',
        })
      },2000)
    }).catch(err=> {
      console.log('err',err)
      this.setState({
        label_resetVideo: 'Failed',
      })
    })
   
  } 


  //Setting video lockTime
  setVideoTime_2 =(time)=>{
    this.setState({isTimeUpdating_2: true})
    setVideoTime({image_id:this.state.image_id,video_lock_time:time,type:'setVideoTime_2'})
    .then((response) => {
      console.log(response)
      if(response.data.message === 'success'){
        this.setState({isTimeUpdating_2: false});
        $('.progress__filled_2').val(lock_percent_2);
        // $('.progress__filled').val(lock_percent);
         console.log(lock_percent_2,lock_percent)
      }else{
        this.setState({isTimeUpdating_2: false});
         $('.progress__filled_2').val(lock_percent_2);
         // $('.progress__filled').val(lock_percent);
      }
      
      setTimeout(()=>{this.vidocontrol3()},3000);
      setTimeout(()=>{this.vidocontrol2()},1000);
        
    }).catch(err=>{
      console.log('err',err)
    })
  }
  //Setting video lockTime
  setVideoTime =(left_lock_time , right_lock_time)=>{
    this.setState({isTimeUpdating: true})
    setVideoTime({image_id:this.state.image_id,left_lock_time:left_lock_time,right_lock_time: right_lock_time,type: 'setVideoTime'})
    .then((response) => {
      console.log(response)
      if(response.data.message === 'success'){
        this.setState({isTimeUpdating: false,left_lock_time: left_lock_time, right_lock_time: right_lock_time});
        $('.progress__filled_2').val(lock_percent_2);
        if(!left_lock_time){
            $('.input-range__slider').eq(0).css({'pointer-events': 'inherit'});
        }
      }else{
        this.setState({isTimeUpdating: false});
         // $('.progress__filled').val(lock_percent);
         $('.progress__filled_2').val(lock_percent_2);
      }
      setTimeout(()=>{this.vidocontrol3()},3000);
      // setTimeout(()=>{this.vidocontrol()},1000);
    }).catch(err=>{
      console.log('err',err)
    })
  }


  handleChangeRange_2=(event)=>{
    this.setState({video_time_2: event.target.value});
  }
  handleChangeRange_3=(event)=>{
    this.setState({video_time_3: event.target.value});
  }

  /*================================
     download combined videos
  =================================*/

  handleExportVideo =()=>{
    console.log('wer')
    this.setState({exporting: true})
    mergeVideos({movie_link: this.state.movie_link, impact_video_url: this.state.trim_video_url ? this.state.trim_video_url :  this.state.impact_video_url})
    .then(res=>{
      if(res.data.message === 'success'){
        var a = document.createElement('a');
        a.href = res.data.file_path;
        a.download = 'kinematics_'+this.state.player_id;
        a.click();
      }
        this.setState({exporting: false});
    })
  }

  render() {
    if (!this.state.isAuthenticated && !this.state.isCheckingAuth) {
      return <Redirect to="/Login" />;
    }
    if (!this.props.match.params.image_id) {
      return <Redirect to="/Login" />;
    }
    if (!this.state.isLoaded) return <Spinner />;

    const files = this.state.files.map(file => (
      <span key={file.name}>
        {file.name} - {file.size} bytes
      </span>
    ));
    var the = this;
    if(this.state.impact_video_url && !called){
      setTimeout(()=>{the.vidocontrol()},1000);
      called = true;
    }
    if(this.state.movie_link && !called_2){
      setTimeout(()=>{the.vidocontrol2()},1000);
      called_2 = true
    }
    if(!called_3){
      setTimeout(()=>{the.vidocontrol3()},3000);
      called_3= true
    }
    return (
      <React.Fragment>
        <div className="center-scroll-up-mobile">
          <ScrollToTop

            showUnder={120}
            style={{
              zIndex: "99"
            }}
          >
            <div

              className=" d-flex align-items-center justify-content-center "
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: "#0f81dc",
                marginLeft: "auto",
                marginRight: "auto",
                color: "#fff",
                borderRadius: "50%",
                boxShadow: "0 3px 6px 0 rgba(0, 0, 0, 0.14)",
                alignItems: "center !important"

              }}
            >
              <img src="/img/icon/arrowUp.svg" alt="" />
            </div>
            <div
              style={{

                color: "#0f81dc",
                backgroundColor: "transparent",
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              <p className="hide-widget-in-mobile">Back to top</p>
            </div>


          </ScrollToTop>
        </div>

        <div className="container dashboard UserDashboarForAdmin-page-navigation brain-simlation-details">

            <div className="container">
              <div className="row">
                
                <div className="col-md-12 col-lg-12">
                  {<div className="backbutton">
                    <Link 
                      to={{
                        pathname: '/TeamAdmin/user/dashboard/'+ this.state.cognito_user_id+'/'+this.state.player_id.split('$')[0]+'?team='+this.state.team_name+'&org='+this.state.organization+'&brand=',
                        state: {
                          user_cognito_id: this.state.userDetails.user_cognito_id,
                          cognito_user_id: this.state.cognito_user_id,
                          player_name: this.state.player_id.split('$')[0],
                          isRedirectedFromAdminPanel: false,
                          team: {
                              brand: '',
                              team_name: this.state.team_name,
                              organization: this.state.organization,
                              staff: ""
                          }
                      }
                    }}
                    >&lt; Back To Player
                    </Link>
                  </div>}
                  <h1 className="top-heading__login brain-simlation-details-title" >Brain Simulation Details</h1>
                  {/* this.state.simulation_log_path && <p className="top-heading__login brain-simlation-details-title" ><a href={this.state.simulation_log_path} target="_blank">Simulation Log File</a></p>*/}
                  <div style={{'text-align':'center','width':'100%'}}>

                    <Link 
                    to={{
                      pathname: '/TeamAdmin/user/dashboard/brainSimulationDetails/simulation/log',
                      state: {
                        image_id: this.state.image_id,
                        return_url: this.props.location.pathname + this.props.location.search
                      }
                    }}>
                   
                      Simulation Log File
                    </Link>
                  </div>
                  <h4 className="brain-simlation-details-subtitle">Player and Impact Number Details</h4>
                </div>
                <div className="col-md-12" > 
                  <div className="user-simlation-details">
                    {this.state.isLoading ? 
                      <span style={{'width': '100%','text-align':'center','padding':'54px'}}>
                          <i className="fa fa-spinner fa-spin" style={{'font-size':'24px'}}></i>
                      </span>
                      :
                        <>
                          <p>Name: {this.state.simulation_data ? this.state.simulation_data.sensor_data.player['first-name'] +' '+this.state.simulation_data.sensor_data.player['last-name'] : ''}</p>
                          <p >
                            Account ID: {this.state.account_id}
                          </p>
                          <p>
                              Simulation ID: {this.state.log_stream_name ? this.state.log_stream_name.split('/')[2] : ''}
                          </p>
                          <p>Impact ID: { this.state.simulation_data ? this.state.simulation_data.sensor_data.player['impact-id'] ? this.state.simulation_data.sensor_data.player['impact-id'] : '' : ''}</p>
                          <p>Position: {this.state.simulation_data ? this.state.simulation_data.sensor_data.player['position'] : ''}</p>
                        </>
                    }
                  </div>
                </div>

                {/*Graph section start*/}
                <div className="col-md-12 col-lg-12 brain-simlation-details-graph">
                  <h4 className="brain-simlation-details-subtitle">Input From Sensor</h4>
                  <div className="col-md-6" style={{'float':'left'}}>
                    {this.state.simulation_data && 
                    <HeadLinearAccelerationAllEvents data={this.state.simulation_data}/>
                    }
                  </div>
                  <div className="col-md-6" style={{'float':'left'}}>
                    {this.state.simulation_data &&
                      <HeadAngularAccelerationAllEvents   data={this.state.simulation_data}/>
                    }
                    
                    
                  </div>
                </div>
                {/*Graph section end*/}

                {/*Movie section start*/}
                  <div className="col-md-12 col-lg-12 brain-simlation-details-movie">
                    <h4 className="brain-simlation-details-subtitle">Video Verification of Skull Kinematics</h4>
                    <div className="col-md-12">
                      <div className="movie">
                        <div className="col-sm-12" >
                          <div className="col-md-6" style={{'float':'left'}}><p class="video-lebel">Simulation Video</p></div>
                          <div className="col-md-6 mobileview-active" style={{'float':'left'}}><p class="video-lebel">Sideline Video</p></div>
                        </div>
                        <div className="col-md-6" style={{'float':'left'}}>
                          <div className="Simulationvideo">
                            {!this.state.movie_link || this.state.simulationStatus === 'pending' ? 
                              <img src={videoSimulationLoading} style={{'width':'50%'}}  alt="img"/>
                              : null
                            }
                            {this.state.movie_link && this.state.simulationStatus !== 'pending' ?
                              <video src={this.state.movie_link} style={{'width':'100%','height':'284px'}} className="player__video_2 viewer_2" controls loop={this.state.isRepeatVideo ? true : false}></video>
                              : null
                            }
                            
                          </div>
                           <div className="Replace-video Replace-video-desktop">
                              <div style={{width:'100%','opacity': '0','pointer-events': 'none'}}>
                                    <label><img src={upload} alt="img"/>  Replace</label>
                              </div>
                            </div>
                          <div>
                            {this.state.isTimeUpdating_2 ?<div> <i className="fa fa-spinner fa-spin" style={{'font-size':'24px'}}></i> </div>: ''}
                            <img src={this.state.video_lock_time_2? lock : unlock} className="unlock-img lock_video_2" onClick={this.handlelock_video_2} alt="img"/>
                            <input type="range" min="0" max="100" step="0.05" value={this.state.video_time_2}  onChange={this.handleChangeRange_2} className="MyrangeSlider1 progress__filled_2" id="MyrangeSlider1" disabled ={!this.state.video_lock_time_2 ? false : true}/>
                            <p style={{'font-weight':'600'}}>Drag slider to set the zero frame</p>
                          </div>
                          
                          <div className="col-md-12">
                            <div className="col-md-6" style={{'float':'left','padding': '8px 0px'}}>Length of video = {this.state.lengthofSimulationVideo}</div>
                            <div className="col-md-6" style={{'float':'left','padding': '8px 0px'}}>Number of frames = {this.state.framesofSimulationVideo}</div>
                          </div>
                        </div>
                        <div className="col-sm-12" >
                          <div className="col-md-6 deskView-active" style={{'float':'left'}}><p class="video-lebel">Sideline Video</p></div>
                        </div>
                        <div className="Replace-video Replace-video-mobile">
                          <div>
                            {/*!-- Video controls Mobile view --*/}
                            {this.state.impact_video_url  ? 
                              <React.Fragment>
                                <label for="uploadFile"><img src={upload} alt="img"/>  Replace</label>
                                <input type="file" id="uploadFile" onChange={this.uploadFile} />
                                <label onClick={this.handalRemoveVideo}><img src={remove} alt="img"/>  {this.state.label_remove_video}</label>
                                <label  onClick={this.trimVideo} ><img src={trim_icon} alt="img"/>  {this.state.label_TrimVideo}</label>
                                <label onClick={this.resetToOriginal} ><img src={reset_icon} alt="img"/>  {this.state.label_resetVideo}</label>
                              </React.Fragment>
                              :
                              <React.Fragment>
                                <label style={{'background':'#b7cce2'}}><img src={upload} alt="img"/>  Replace</label>
                                <label style={{'background':'#b7cce2'}}><img src={remove} alt="img"/>  {this.state.label_remove_video}</label>
                                <label style={{'background':'#b7cce2'}}><img src={trim_icon} alt="img"/>  {this.state.label_TrimVideo}</label>
                                <label style={{'background':'#b7cce2'}}><img src={reset_icon} alt="img"/>  {this.state.label_resetVideo}</label>
                              </React.Fragment>
                            }
                            {/*!-- Video controls end --*/}
                          </div>
                        </div>
                        <div className="col-md-6" style={{'float':'left'}}>
                          {!this.state.impact_video_url ?
                            (<Dropzone onDrop={this.onDrop}>
                              {({getRootProps, getInputProps}) => (
                                <section className="container">
                                  <div className='impact-video'  {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    
                                     {this.state.isLoading ? (
                                      <div className="d-flex justify-content-center center-spinner" style={{'margin-top':'28%'}}>
                                      <ProgressBar animated now={this.state.uploadPercentage} label={`${this.state.uploadPercentage}%`} />
                                       
                                      </div>
                                    ) : this.state.status ? <p style={{'margin-top':'25%','color':'red'}}>{this.state.status}</p>
                                      :<React.Fragment>
                                        <img src={uploadicon} style={{'width':'40%'}} alt="upload video"/>
                                        <p>Upload Sideline Video of Impact</p>
                                      </React.Fragment>
                                    }
                                  </div>
                                  <p>{files}</p>
                                </section>
                              )}
                            </Dropzone>)
                            : 
                              <div className="player">
                                {this.state.trim_video_url ?
                                  <video src={this.state.trim_video_url} style={{'width':'100%','height':'284px'}} className="player__video viewer" controls loop={this.state.isRepeatVideo ? true : false}></video>
                                
                                :
                                  <video src={this.state.impact_video_url} style={{'width':'100%','height':'284px'}} className="player__video viewer" controls loop={this.state.isRepeatVideo ? true : false}></video>
                                }
                                {this.state.SidelineVidoeCT && <div id="custom-message">{this.state.SidelineVidoeCT}</div>}
                              </div>
                             
                          }
                          <div>
                            <div className="Replace-video Replace-video-desktop">
                              <div style={{width:'100%'}}>
                                {/*!-- Video controls Desktop view --*/}
                                {this.state.impact_video_url ?
                                  <React.Fragment>
                                    <label for="uploadFile"><img src={upload} alt="img"/>  Replace</label>
                                    <input type="file" id="uploadFile" onChange={this.uploadFile} />
                                    <label onClick={this.handalRemoveVideo}><img src={remove} alt="img"/>  {this.state.label_remove_video}</label>
                                    <label  onClick={this.trimVideo} > {this.state.isTriming ? <i className="fa fa-spinner fa-spin" style={{'font-size':'24px'}}></i> : <><img src={trim_icon} alt="img"/>  {this.state.label_TrimVideo}</>} </label>
                                    <label onClick={this.resetToOriginal}><img src={reset_icon} alt="img"/>  {this.state.label_resetVideo}</label>

                                  </React.Fragment>
                                  :
                                  <React.Fragment>
                                    <label style={{'background':'#b7cce2'}}><img src={upload} alt="img"/>  Replace</label>
                                    <label style={{'background':'#b7cce2'}}><img src={remove} alt="img"/>  {this.state.label_remove_video}</label>
                                    <label style={{'background':'#b7cce2'}}> {this.state.isTriming ? <i className="fa fa-spinner fa-spin" style={{'font-size':'24px'}}></i> : <><img src={trim_icon} alt="img"/>  {this.state.label_TrimVideo}</>} </label>
                                    <label style={{'background':'#b7cce2'}}><img src={reset_icon} alt="img"/>  {this.state.label_resetVideo}</label>
                                  </React.Fragment>
                                }
                                {/*!-- Video controls end --*/}
                              </div>
                            </div>
                          </div>

                          <div>
                          {this.state.isTimeUpdating ? <i className="fa fa-spinner fa-spin" style={{'font-size':'24px'}}></i> : ''}
                          </div>
                          <div>
                            <div className="col-sm-12 sideliene-video-sliders no-padding">
                              <div className="col-sm-1 no-padding" style={{'float':'left'}}>
                                <img src={this.state.left_lock_time? lock : unlock} className="unlock-img-2 lock_video" onClick={() => this.handlelock_video('left')} alt="img"/>
                              </div>
                              {/*<input type="range" min="0" max="100" step="0.05" value={this.state.video_time}  onChange={this.handleChangeRange} className="MyrangeSlider1 progress__filled" id="MyrangeSlider1" disabled ={!this.state.video_lock_time_2 ? false : true}/>*/}
                              <div className="col-sm-10 no-padding" style={{'float':'left'}}>
                                <InputRange
                                  maxValue={100}
                                  minValue={0}
                                  step={2}
                                  value={this.state.value}
                                  onChange={value => this.setRangeValue(value)} 
                                />
                              </div>
                              <div className="col-sm-1 no-padding" style={{'float':'left'}}>
                                <img src={this.state.right_lock_time? lock : unlock} className="unlock-img-2 lock_video" onClick={() =>  this.handlelock_video('right')} alt="img"/>
                              </div>
                            </div>
                            <p style={{'font-weight':'600'}}>Drag slider to set the zero frame</p>
                          </div>
                          {/*<div>
                            <div className="col-sm-1 no-padding" style={{'float':'left'}}>
                              <img src={unlock} className="unlock-img-2" alt="img"/>
                            </div>
                            <div className="col-sm-10 no-padding" style={{'float':'left'}}>
                              <input type="range" min="0" max="100" step="0.05" value={this.state.video_time}  onChange={this.handleChangeRange} className="MyrangeSlider2 progress__filled" id="MyrangeSlider2" />
                            </div>
                            <div className="col-sm-1 no-padding" style={{'float':'left'}}>

                            </div>
                            <p style={{'font-weight':'600'}}>Adjust the frame rate</p>
                          </div>*/}
                          <div className="col-md-12">
                            <div className="col-md-6" style={{'float':'left','padding': '8px 0px'}}>Length of video = {this.state.lengthofSidelineVideo}</div>
                            <div className="col-md-6" style={{'float':'left','padding': '8px 0px'}}>Number of frames = {this.state.framesofSidelineVideo}</div>
                          </div>
                        </div>
                        
                        <div className="col-md-12">
                          <div className="video-controlls">
                            <div className="col-sm-6" style={{'float':'left'}}>
                              <img src={this.state.controlPlayVideo ? video_play_bl : video_pause_b} className="control-1 control_play_video" alt="img"/>
                              <img src={this.state.controlPouseVideo? pause_bl : pause_b}  className="control-1 control_pouse_video" alt="img"/>
                              <img src={this.state.isRepeatVideo ? video_loop_bl : video_loop_b}  className="control-2 control_loop_video" alt="img"/>
                            </div>
                            <div className="col-sm-6" style={{'float':'left'}}>
                              <button onClick={this.handleExportVideo} disabled={!this.state.movie_link || !this.state.impact_video_url ? true : false} style={!this.state.movie_link || !this.state.impact_video_url ? {'background': '#b7cce2'} : {'background': '#4472c4'}}>
                                {this.state.exporting ? 
                                  <>
                                    Rendering <i className="fa fa-spinner fa-spin" style={{"font-size":"24px"}}></i> 
                                  </>
                                 : 
                                 <>
                                  <img src={icon_download_white} className="Combined-video-icon"  alt="img"/>
                                  Export Combined Video
                                  </>
                                }</button>
                            </div>
                          </div>
                        </div>
                        {this.state.isCommonControl && 
                          <div className="" style={{'padding': '0px 14px'}}>
                            <div className="bottom-large-slider">
                              {/*<img src={this.state.lock_video_3? lock : unlock} className="unlock-img lock_video_3" onClick={this.handlelock_video_3} style={{'width': '2.5%'}}/>*/}
                              <input type="range"  min="1" max="100" value={this.state.video_time_3}  onChange={this.handleChangeRange_3} className="MyrangeSlider3 progress__filled_3" id="MyrangeSlider3" />
                              <p style={{'font-weight':'600'}}>Drag slider to advance both movies. The start time for each video can be adjust and locked above.</p>
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                {/*Movie section start*/}

                {/*========== Brain Response Prediction section ==========*/}
                  <div className="col-md-12 col-lg-12 brain-simlation-details-movie">
                    <h4 className="brain-simlation-details-subtitle">Brain Response Prediction</h4>
                    <div className="col-md-12">
                      <div className="movie">
                          <div style={{'width': '100%','display': 'flow-root'}}>
                            <p  className="video-lebel">Motion Video</p>
                          </div>
                          {!this.state.motion_link_url || this.state.simulationStatus === 'pending' ? 
                              <img src={videoSimulationLoading} style={{'width':'50%'}} alt="img"/>
                              : null
                          }
                          {this.state.motion_link_url && this.state.simulationStatus !== 'pending' ? 
                            <video src={this.state.motion_link_url} style={{'width':'50%','height':'284px'}}  controls></video>
                            : null
                          }
                      </div>
                    </div>
                  </div>
                {/*========== Brain Response Prediction section end ==========*/}

                {/*Injury metrics section start */}
                <div className="col-md-12 col-lg-12 brain-simlation-details-metrics">
                    <h4 className="brain-simlation-details-subtitle">Resulting Predicted Injury Metrics</h4>
                    <div className="col-md-12">
                      <div className="metrics">
                          <div className="col-md-12">
                            <button className="btn btn-primary">Injury Metrics</button><br/>
                            <button className="btn gray">MPS</button>
                            <button className="btn gray">CSDM</button>
                            <button className="btn gray">MASxSR<sub>15</sub></button>
                          </div>
                          <div className="col-md-12">
                            <img class="img-fluid svg" width="100%" height="60%" src={this.state.simulationData.simulationImage ? this.props.simulationStatus !== 'pending' ?  'data:image/png;base64,' + this.state.simulationData.simulationImage : simulationLoading : simulationLoading} alt="img" />
                            
                          </div>
                      </div>
                    </div>
                </div>
                {/*Injury metrics section start */}

              </div>
            </div>
        </div>
        <Footer />
      </React.Fragment>
    );
  }
  
  getSimlationImage =()=>{
    getSimulationDetail({image_id: this.state.image_id})
    .then(response => {
        if(!state_updated){
          this.setState({
              simulationData: response.data.data,
          });
          state_updated = true;
        }
    })
  }
  getPlayerUserDetails=(player_id, brand)=>{
    let congito_id = player_id.split('$')[0]+'-'+brand
    console.log('congito_id', congito_id)
    getUserDetails({ user_cognito_id: congito_id })
    .then(response => {
      console.log('user details =================================\n',response)
      if(response.data.message === "success"){
        this.setState({
            account_id: response.data.data.account_id,
            isLoading: false
        })
      }else{
        this.setState({
            isLoading: false
        })
      }
    }).catch(err=>{
        console.log('err ',err)
        this.setState({
            isLoading: false
        })
    })
  }

  componentDidMount() {
    const params = new URLSearchParams(window.location.search)
    console.log('this.props.match.params.player_id',params.get('org'))
    let organization = params.get('org');
    let team = params.get('t');
    let brand = params.get('brand');

    this.setState({team_name: team, organization: organization});
 
    isAuthenticated(JSON.stringify({}))
      .then((value) => {
        
          if (value.data.message === 'success') {
            getUserDBDetails()
              .then((response) => {
                  console.log('response.data.data',response.data.data)
                  this.setState({
                      user: true,
                      userDetails: response.data.data,
                  })
                  getBrainSimulationMovie(this.state.image_id).then((response) => {
                  console.log('movie_link',response)
                    this.setState({
                        movie_link:response.data.movie_link,
                        simulation_id: response.data.simulation_id && response.data.simulation_id !== null ? response.data.simulation_id.split("/")[2] : 'NA',
                        impact_video_url: response.data.impact_video_url,
                        motion_link_url: response.data.motion_link_url,
                        left_lock_time: response.data.left_lock_time, 
                        right_lock_time: response.data.right_lock_time, 
                        video_lock_time_2: response.data.video_lock_time_2, 
                        trim_video_url: response.data.trim_video_url,
                        simulationStatus: response.data.status,
                        log_stream_name: response.data.log_stream_name,
                    });

                    if (response.data.account_id) {
                      this.setState({
                        account_id: response.data.account_id,
                        isLoading: false
                      });
                    } else {
                      this.getPlayerUserDetails(this.props.match.params.player_id.split('$')[0], brand);
                    }

                    this.getSimlationImage();
                    getCumulativeAccelerationTimeRecords({  organization: organization, player_id: this.state.player_id, team: team })
                    .then(res=>{
                      console.log('res',res);
                      if(res.data.message !== "failure"){
                        console.log('success')
                        console.log('res',res);
                        this.setState({
                          simulation_data: res.data.data[0],
                          isLoaded: true,
                          isAuthenticated: true,
                          isCheckingAuth: true
                        })
                      }else{
                        console.log('error')
                         this.setState({
                            isAuthenticated: false,
                            isCheckingAuth: false
                        });
                      }
                    }).catch(err=>{
                      console.log('err',err);
                      this.setState({
                          isLoaded: true,
                          userDetails: {},
                          isAuthenticated: false,
                          isCheckingAuth: false
                      });
                    })
                  }).catch((error) => {
                    this.setState({
                        isLoaded: true,
                        userDetails: {},
                        isCheckingAuth: false
                    });
                });
              }).catch((error) => {
                  this.setState({
                      userDetails: {},
                      isCheckingAuth: false
                  });
              });
          }
          else {
             this.setState({
                userDetails: {},
                isCheckingAuth: false
            });
          }
      })
      .catch((err) => {
        this.setState({ isAuthenticated: false, isCheckingAuth: false });
      });
  }
}

export default Details;
