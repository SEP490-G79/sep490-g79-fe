import { Button } from '@/components/ui/button';
import React from 'react'
interface Step3Props {
  onNext: () => void;
  onBack: () => void;
}
const Step3_SubmissionForm = ({   onNext }: Step3Props) => {
  return (
    <div>Step3_SubmissionForm
         <div className="text-right">
            <Button onClick={onNext}>Tôi đồng ý và tiếp tục</Button>
          </div>
    </div>
  )
}

export default Step3_SubmissionForm