import React, {useState, useEffect} from "react";
import {Button, Checkbox, Icon, TextArea, Form} from "semantic-ui-react";
import {sampleGraphs} from "../SampleGraphs/sampleGraphs";

export const postFeedback = (body) => {
  const formData = new URLSearchParams();
  formData.append("project", "neuler")
  formData.append("helpful", body.helpful)
  formData.append("url", `@neuler/${body.page}`)

  if(body.reason) {
    formData.append("reason", body.reason)
  }

  if(body.moreInformation) {
    formData.append("moreInformation", body.moreInformation)
  }

  fetch('https://uglfznxroe.execute-api.us-east-1.amazonaws.com/dev/Feedback', {
    method: 'post',
    body: formData,
    mode: "no-cors"
  }).then(function(response) {
    return response;
  }).then(function(data) {
    console.log(data)
  }).catch(error => {
    console.log(error)
  });
}

export const FeedbackForm = (props) => {
  const [open, setOpen] = useState(true);
  const [feedback, setFeedback] = useState({complete: false})

  const [page, setPage] = useState(props.page)
  useEffect(() => {
    setPage(props.page);
    setFeedback({complete: false})
  }, [props.page])

  let View

  const helpLink = "http://community.neo4j.com/new-topic?title=NEuler%20Problem&body=Hi%20%40mark.needham%2C%0A%0AI%27m%20having%20problems%20getting%20NEuler%20to%20work.%20%0A%0A%3CAdd%20detail%20here%3E%0A%0APlease%20can%20you%20help%3F%0A%0A&category=neo4j-graph-platform/graph-algorithms&tags=neuler"
  if (feedback.complete) {
    const message = feedback.success ?
        "Thanks for your feedback. We're happy to hear that NEuler is serving you well!" :
        <React.Fragment>
          <p>Thanks for your feedback. We'll take it account when we're updating NEuler.</p>
          <p>Feedback submitted via this form is anonymous. If you need a reply to help you solve a problem you're having with NEuler,
            you can <a target="_blank" rel="noopener noreferrer" href={helpLink}>create a topic on the community site</a> and we'll try to help.
          </p>
          <Button primary as='a' href={helpLink} target="_blank">
            Post on community site
          </Button>
        </React.Fragment>
    View = <FeedbackThanks open={open} setOpen={setOpen} message={message}/>
  } else {
    if (feedback.success === undefined) {
      View = <FeedbackFirstScreen open={open} setOpen={setOpen} response={(wasSuccessful) => {
        const newFeedback = {success: wasSuccessful}
        if (wasSuccessful) {
          newFeedback.complete = true
          postFeedback({page: page, helpful: true})
        }
        setFeedback(newFeedback)
      }}/>
    } else {
      View = <FeedbackSecondScreen open={open} setOpen={setOpen}
                                   skip={() => {
                                     const newFeedback = {complete: true, success: false }
                                     setFeedback(newFeedback)

                                     postFeedback({page: page, helpful: false})
                                   }}
                                   submit={(reason, moreInformation) => {
                                     const newFeedback = {complete: true, success: false, reason: reason, moreInformation: moreInformation }
                                     setFeedback(newFeedback)

                                     postFeedback({page: page, helpful: false, reason: reason, moreInformation: moreInformation})
                                   }}/>
    }

  }

  return <div id="search-feedback-module"
              style={{
                boxShadow: "rgba(0, 0, 0, 0.17) 0px 2px 10px",
                width: "300px",
                background: "rgb(249, 251, 253)",
                position: "fixed",
                bottom: "12px",
                right: "12px",
                borderRadius: "5px",
                opacity: "1"
              }}>
    {View}
  </div>
}

const headerStyle = {
  padding: "18px 24px",
  fontSize: "16px",
  margin: "0px",
  borderTopLeftRadius: "5px",
  borderTopRightRadius: "5px",
  fontWeight: "normal",
  borderBottom: "1px solid rgba(210, 213, 218, 0.5)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
  background: "hsl(210, 16%, 82%)",
  color: "hsl(209, 20%, 25%)  "
};

const FeedbackFirstScreen = (props) => {
  const outerStyle = {padding: "24px"}
  const innerStyle = {marginBottom: "10px", color: "#000"}

  if (!props.open) {
    innerStyle.display = "none"
    outerStyle.display = "none"
  }

  return <React.Fragment>
    <h4 style={headerStyle} onClick={() => props.setOpen(!props.open)}>Help us improve NEuler <Icon className="angle down large" /></h4>
    <div style={outerStyle}>
      <form>
        <div style={innerStyle}><p>Were you able to do what you wanted?</p>

          <div>
            <Icon className="thumbs up big green feedback-icon" style={{marginRight: "5px", fontSize: "2.5em"}} onClick={() => props.response(true)}/>
            <Icon className="thumbs down big red feedback-icon" style={{fontSize: "2.5em"}} onClick={() => props.response(false)} />
          </div>

        </div>

      </form>
    </div>
  </React.Fragment>
}

const FeedbackSecondScreen = (props) => {
  const outerStyle = {padding: "24px"}
  const innerStyle = {marginBottom: "10px", color: "#000"}

  if (!props.open) {
    innerStyle.display = "none"
    outerStyle.display = "none"
  }

  let [reason, setReason] = useState("results")
  let [moreInformation, setMoreInformation] = useState("")

  return <React.Fragment>
    <h4 style={headerStyle}>Help us improve NEuler <Icon className="angle down large" onClick={() => props.setOpen(!props.open)}/></h4>
    <div style={outerStyle}>
      <form>
        <div style={innerStyle}>
          <p>Thanks for your feedback. How can we improve?</p>
          <Form style={{marginBottom: "10px"}}>

            <Form.Field>
              <Checkbox
                  className="feedback-form"
                radio
                label="Results are confusing or don't make sense"
                name='checkboxRadioGroup'
                value='results'
                checked={reason === 'results'}
                onChange={() => setReason("results")}
              />
            </Form.Field>
            <Form.Field>
              <Checkbox
                  className="feedback-form"
                radio
                label="Missing algorithm or functionality"
                name='checkboxRadioGroup'
                value='missing'
                checked={reason === 'missing'}
                onChange={() => setReason("missing")}
              />
            </Form.Field>
            <Form.Field>
              <Checkbox
                  className="feedback-form"
                  radio
                label="The app is confusing/I don't know what to do"
                name='checkboxRadioGroup'
                value='hard-to-follow'
                checked={reason === 'hard-to-follow'}
                onChange={() => setReason("hard-to-follow")}
              />
            </Form.Field>
            <Form.Field>
              <Checkbox
                className="feedback-form"
                radio
                label='It has another problem not covered by the above'
                name='checkboxRadioGroup'
                value='other'
                checked={reason === 'other'}
                onChange={() => setReason("other")}
              />
            </Form.Field>

            <TextArea id="feedback-form" placeholder='Tell us more' onChange={(event, data) => setMoreInformation(data.value)}  rows={5} />
          </Form>

          <Button onClick={(e) => {props.submit(reason, moreInformation); e.preventDefault()}}>Submit</Button>
          {/*<Button onClick={(e) => {props.skip(); e.preventDefault()}}>Skip</Button>*/}

        </div>

      </form>
    </div>
  </React.Fragment>
}


const FeedbackThanks = (props) => {
  const outerStyle = {padding: "24px"}
  const innerStyle = {color: '#000'}

  if (!props.open) {
    innerStyle.display = "none"
    outerStyle.display = "none"
  }

  return <React.Fragment>
    <h4 style={headerStyle}>Help us improve NEuler
      <Icon className="angle down large" onClick={() => props.setOpen(!props.open)}/>
    </h4>
    <div style={outerStyle}>
      <div style={innerStyle}>
        <p>{props.message}</p>
      </div>

    </div>
  </React.Fragment>
}
