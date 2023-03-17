import "https://deno.land/x/xhr@0.3.0/mod.ts";

type SubscriptionStatus =
  "Error"
  | "Subscribed";

// Use this ans the 'TEST' block below for testing
//const MAILCHIMP_URL = "http://localhost:8888/signup?TEST=true";
const MAILCHIMP_URL = "https://wytchelmgrotto.us20.list-manage.com/subscribe/post?u=ecff512b8567c67909af60ab5&amp;id=a372ec2ebe&amp;f_id=00297feaf0https://wytchelmgrotto.us20.list-manage.com/subscribe/post?u=ecff512b8567c67909af60ab5&amp;id=a372ec2ebe&amp;f_id=00297feaf0";

const QUERY_PARAM_NAME = "signup_status";
const HASH_NAME = "signup-form";

function redirectBackWithStatus(subStatus: SubscriptionStatus, details?: string) {
  if (subStatus === "Subscribed") {
    return new Response("Success", {
      status: 302,
      statusText: "Successfully Subscribed",
      headers: {
        Location: `/?${QUERY_PARAM_NAME}=${subStatus}#${HASH_NAME}`
      }
    });
  }

  return new Response("Error", {
    status: 302,
    statusText: details || "Something went wrong",
    headers: {
      Location: `/?${QUERY_PARAM_NAME}=${subStatus}#${HASH_NAME}`
    }
  });
}

export default async (request: Request) => {
  if (!request.headers.get('Content-Type')?.includes('application/x-www-form-urlencoded') ?? false) {
    return new Response('Invalid', {
      status: 400,
      statusText: 'Form required'
    });
  }

  /*
  if (new URL(request.url).searchParams.get('TEST') === "true") {
    console.info('We got it!');
    try {
      const forwadedForm = await request.formData();
      console.info('And the form!', forwadedForm);
    } catch (err) {
      console.info('Well, we got: ', err);
    }
    return new Response('Test', { status: 200, statusText: 'OK' });
  }
  */

  const form = await request.formData();

  let res: Function, rej: Function;
  const formSubmission = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
  })

  const mailchimpRequest = new XMLHttpRequest();
  mailchimpRequest.open("POST", MAILCHIMP_URL);
  mailchimpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  mailchimpRequest.send(form);
  mailchimpRequest.onreadystatechange = () => {
    if (mailchimpRequest.readyState === XMLHttpRequest.DONE) {
      const status = mailchimpRequest.status;
      if (status === 0 || (status >= 200 && status < 400)) {
        res();
      } else {
        rej(`${status} ${mailchimpRequest.statusText}`)
      }
    }
  }

  try {
    await formSubmission;
    return redirectBackWithStatus("Subscribed");
  } catch (err) {
    console.error(err);
    if (typeof err === "string") {
      return redirectBackWithStatus("Error", err);
    }
    if (err instanceof Error) {
      return redirectBackWithStatus("Error", err.message || "An error occured");
    }

    return redirectBackWithStatus("Error", "An error occured");
  }
};
