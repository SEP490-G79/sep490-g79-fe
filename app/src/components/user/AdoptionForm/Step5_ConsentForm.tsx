import React from 'react'


interface Step4Props {
  onNext: () => void;
  onBack: () => void;
  submission : any;

}
const Step5_ConsentForm = ({submission }: Step4Props) => {
  console.log("heheh",submission);
  
  return (
    <div>Step4_ScheduleConfirm</div>

  )
}

export default Step5_ConsentForm