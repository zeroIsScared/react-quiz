import Option from "./Option";

const Question = ({question, ...props}) => {
    console.log(question)
    return (
        <div>
            <h4>{question.question}</h4>
            <Option question= {question} {...props}/>           
            
        </div>
    )
}

export default Question;