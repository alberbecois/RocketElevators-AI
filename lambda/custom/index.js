/* eslint-disable  func-names */
/* eslint-disable  no-console */
const Alexa = require('ask-sdk-core');
const request = require('request');

// The function for welcoming people
const GetWelcomeHandler = {
  canHandle(handlerInput) { return handlerInput.requestEnvelope.request.type === "LaunchRequest"; },
  // Creating the outputSpeech constant and returning it
  handle(handlerInput) {
    const outputSpeech = "Hello, my name is Alexa. How can I help you today?";
    return handlerInput.responseBuilder.speak(outputSpeech).reprompt().getResponse();
  }
};


const GetRemoteDataHandler = {
  canHandle(handlerInput) {
    return  (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetRemoteDataIntent');
  },
  async handle(handlerInput) {
    let outputSpeech = 'This is the default message.';
    await getRemoteData('https://rocketelev.azurewebsites.net/api/columns/get/status/active')
      .then((response) => {
        const data = JSON.parse(response);
        outputSpeech = `There are currently ${data.length} elevator active. `;
      })
      .catch((err) => {
        //set an optional error message here
        "Shit ain't working"
        //outputSpeech = err.message;
      });
    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .getResponse();
  },
};


// The function for returning all of the information when asked "Hey Alexa, What is going on at Rocket Elevators?"

const GetAllInformationHandler = {
  canHandle(handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'IntentRequest' && handlerInput.requestEnvelope.request.intent.name === 'GetAllInformationIntent'); },
  async handle(handlerInput) {
    let outputSpeech = 'This is the default message.';
    
    // All the constants holding the GET requests
    const getelevatorToText = await getRemoteData('http://floating-citadel-15630.herokuapp.com/api/elevators/get/status/all')
    const getElevatorNotActive = await getRemoteData('http://floating-citadel-15630.herokuapp.com/api/elevators')
    const getbuildingToText = await getRemoteData('http://floating-citadel-15630.herokuapp.com/api/buildings/')
    const getcustomerToText =  await getRemoteData('http://floating-citadel-15630.herokuapp.com/api/customers')
    const getelevatorInactive =  await getRemoteData('http://floating-citadel-15630.herokuapp.com/api/elevators/get/status/inactive')
    const getelevatorIntervention =  await getRemoteData('http://floating-citadel-15630.herokuapp.com/api/elevators/get/status/intervention')
    const getBattery = await getRemoteData('http://floating-citadel-15630.herokuapp.com/api/batteries/')
    const getLead = await getRemoteData('http://floating-citadel-15630.herokuapp.com/api/leads')
    const getCity = await getRemoteData('http://floating-citadel-15630.herokuapp.com/api/addresses/city')
    const getQuote = await getRemoteData('http://floating-citadel-15630.herokuapp.com/api/quotes')
    
    // Parsing the GET requests as JSON
    
    const elevator = JSON.parse(getelevatorToText)
    const building = JSON.parse(getbuildingToText)
    const customer = JSON.parse(getcustomerToText)
    const elevatorInactiveOrIntervention = JSON.parse(getElevatorNotActive)
    const totalElevatorNotRunning  = parseInt(elevator.length) - parseInt(elevatorInactiveOrIntervention.length)
    const batteries = JSON.parse(getBattery)
    const lead = JSON.parse(getLead)
    const city = JSON.parse(getCity)
    const quote = JSON.parse(getQuote)
    
    // Creating the output speech with the previously declared constants
    
    outputSpeech = `Greetings, there are currently ${elevator.length} elevators deployed in the ${building.length} buildings
    of your ${customer.length} customers. Currently, ${totalElevatorNotRunning} are not in Running Status and are being serviced.
    ${batteries.length} Batteries are deployed across ${city.length} cities. On another note, you currently have ${quote.length} 
    quotes awaiting processing. You also have ${lead.length} leads in your contact requests.`;
    // Returning the output speech
    
    return handlerInput.responseBuilder.speak(outputSpeech).getResponse();
    
  },
};

// The function to get the status of a specific elevator
const GetElevatorStatusHandler = {
  canHandle(handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetElevatorStatusIntent');
  },
  async handle(handlerInput) {
    let outputSpeech = "This is the default message.";
    
    const id = handlerInput.requestEnvelope.request.intent.slots.id.value;
    
    // The constant that contain all of the elevator to validate the selection
    
    const elevatorTotal = await getRemoteData('http://floating-citadel-15630.herokuapp.com/api/elevators/get/status/all');
    const elevatorLength = JSON.parse(elevatorTotal)
    
    if (id > elevatorLength.length) {
        
    outputSpeech = `The ${id} exceed the number of elevator. The number of elevator deployed is ${elevatorLength.length} `;
      return handlerInput.responseBuilder
        .speak(outputSpeech)
        .reprompt()
        .getResponse();
    }
    const elevatorStatus = await getRemoteData('http://floating-citadel-15630.herokuapp.com/api/elevators/' + id);
    
    // Parsing the GET requests as JSON
    const elevator = JSON.parse(elevatorStatus).status;
    
    // Creating the output speech with the previously declared constants
        
    outputSpeech = `The status of elevator ${id} is ${elevator} `;
    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .reprompt()
      .getResponse();
  }
};

// The function to get the status of a specific column
const GetColumnStatusHandler = {
  canHandle(handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetColumnStatusIntent');
  },
  async handle(handlerInput) {
    let outputSpeech = "This is the default message.";
    
    const idColumn = handlerInput.requestEnvelope.request.intent.slots.idColumn.value;

    // The constant that contain all of the elevator to validate the selection
    const columnTotal = await getRemoteData('http://floating-citadel-15630.herokuapp.com/api/columns');
    // Parsing the GET requests as JSON for all colmumn
    const columnLength = JSON.parse(columnTotal)
    
    if (idColumn > columnLength.length) {
        
    outputSpeech = `The ${idColumn} exceed the number of column. The number of column deployed is ${columnLength.length} `;
      return handlerInput.responseBuilder
        .speak(outputSpeech)
        .reprompt()
        .getResponse();
    }
    
    const columnStatus = await getRemoteData('http://floating-citadel-15630.herokuapp.com/api/columns/' + idColumn);
        // Parsing the GET requests as JSON for the specific column
    const column = JSON.parse(columnStatus);
    
    // Creating the output speech with the previously declared constants
    outputSpeech = `The status of column ${idColumn} is ${column.status} `;
    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .reprompt()
      .getResponse();
  }
};


// The function to get the status of a specific battery
const GetBatterieStatusHandler = {
  canHandle(handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetBatteryStatusIntent');
  },
  async handle(handlerInput) {
      
    let outputSpeech = "This is the default message.";
    
    const idBattery = handlerInput.requestEnvelope.request.intent.slots.idBattery.value;
    
    // The constant that contain all of the elevator to validate the selection
    const batteryTotal = await getRemoteData('http://floating-citadel-15630.herokuapp.com/api/batteries');
    // Parsing the GET requests as JSON for all batteries
    const batteryLength = JSON.parse(batteryTotal)
    
    if (idBattery > batteryLength.length) {
        
    outputSpeech = `The ${idBattery} exceed the number of battery. The number of battery deployed is ${batteryLength.length}`;
      return handlerInput.responseBuilder
        .speak(outputSpeech)
        .reprompt()
        .getResponse();
    }
    
    const batteryStatus = await getRemoteData('http://floating-citadel-15630.herokuapp.com/api/batteries/' + idBattery);
    // Parsing the GET requests as JSON for the specific battery
    const battery = JSON.parse(batteryStatus).status;
    
    // Creating the output speech with the previously declared constants
    outputSpeech = `The status of battery ${idBattery} is ${battery} `;
    
    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .reprompt()
      .getResponse();
  }
};


// The function to get the informations for  of a specific intervention
const GetInterventionHandler = {
  canHandle(handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetInterventionIntent');
  },
  async handle(handlerInput) {
    let outputSpeech = "This is the default message.";
    const idIntervention = handlerInput.requestEnvelope.request.intent.slots.idIntervention.value;
    
    // The constant that contain all of the intervention to validate the selection
    const interventiontotal = await getRemoteData('http://floating-citadel-15630.herokuapp.com/api/interventions/');
    // Parsing the GET requests as JSON for all intervention
    const interventionLength = JSON.parse(interventiontotal)
    
    if (idIntervention > interventionLength.length) {
        
    outputSpeech = `The ${idIntervention} exceed the number of intervention. The number of intervention is ${interventionLength.length}`;
      return handlerInput.responseBuilder
        .speak(outputSpeech)
        .reprompt()
        .getResponse();
    }
    
    const internvetionInfo = await getRemoteData('http://floating-citadel-15630.herokuapp.com/api/interventions/' + idIntervention);
    // Parsing the GET requests as JSON for the specific intervention
    const intervention = JSON.parse(internvetionInfo)

    // Creating the output speech with the previously declared constants
    outputSpeech = `The intervention ${idIntervention} author id is ${intervention.author_id}, the customer id is ${intervention.customer_id}.
    The building id is ${intervention.building_id}. the battery id is ${intervention.battery_id}, the column id is ${intervention.column_id} and the elevator id is ${intervention.elevator_id}.
    The employee id assigned to the call is ${intervention.employee_id}`;
    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .reprompt()
      .getResponse();
  }
};


// The function to get the informations for of a specific customer
const GetCustomerHandler = {
  canHandle(handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetCustomerIntent');
  },
  async handle(handlerInput) {
    let outputSpeech = "This is the default message.";
    const idCustomer = handlerInput.requestEnvelope.request.intent.slots.idCustomer.value;
    
    // The constant that contain all of the intervention to validate the selection
    const customerTotal = await getRemoteData('https://floating-citadel-15630.herokuapp.com/api/customers');
        // Parsing the GET requests as JSON for all customers
    const customerLength = JSON.parse(customerTotal)
    
    if (idCustomer > customerLength.length) {
        
    outputSpeech = `The ${idCustomer} exceed the number of customer. The number of customer is ${customerLength.length}`;
      return handlerInput.responseBuilder
        .speak(outputSpeech)
        .reprompt()
        .getResponse();
    }
    
    const customerInfo = await getRemoteData('https://floating-citadel-15630.herokuapp.com/api/customers/' + idCustomer);
    // Parsing the GET requests as JSON for the specific customer
    const customer = JSON.parse(customerInfo)

    // Creating the output speech with the previously declared constants
    outputSpeech = `The customer ${idCustomer} address id is ${customer.address_id}, the business name of the customer is ${customer.business_name}.
    The contact full name is ${customer.contact_full_name}. The phone number is ${customer.contact_phone}, the email is ${customer.contact_email}. The business description is  ${customer.business_description}.
    The technician full name ${customer.technician_full_name}, is phone number is ${customer.technician_phone} and is email is ${customer.technician_email}`;
    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .reprompt()
      .getResponse();
  }
};

const ChangeInterventionStatusToProgressHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "ChangeInterventionStatusToInProgressIntent"
    );
  },
  async handle(handlerInput) {
      
    const interventionIdStatus = handlerInput.requestEnvelope.request.intent.slots.interventionIdStatus.value;
      
    
    const callMethod = await httpPutInterventionStatusInProgress(interventionIdStatus);

    // Creating the output speech with the previously declared constants
    const outputSpeech =` The status of intervention id ${interventionIdStatus} is change to in progress `

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .reprompt()
      .getResponse();
  }
};

async function httpPutInterventionStatusInProgress(id) {
return new Promise((resolve, reject) =>{
  request({
      uri: "https://floating-citadel-15630.herokuapp.com/api/interventions/"+id+"/inProgress",
      method: 'PUT',
      headers: {
          'Content-type': 'application/json'
      }
    },
    (error, response) => {
        if(error){
          return reject(error);
        }
        return resolve();
  });
});
}


const ChangeInterventionStatusToCompletedHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "ChangeInterventionStatusToCompletedIntent"
    );
  },
  async handle(handlerInput) {
    const interventionIdCompleted = handlerInput.requestEnvelope.request.intent.slots.interventionIdCompleted.value;
    const callMethod = await httpPutInterventionStatusToCompleted(interventionIdCompleted);
    // Creating the output speech with the previously declared constants
    const outputSpeech =` The status of intervention id ${interventionIdCompleted} is change to in completed`
    
    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .reprompt()
      .getResponse();
  }
};


async function httpPutInterventionStatusToCompleted(id) {
return new Promise((resolve, reject) =>{
  request({
      uri: "https://floating-citadel-15630.herokuapp.com/api/interventions/"+id+"/completed",
      method: 'PUT',
      headers: {
          'Content-type': 'application/json'
      }
    },
    (error, response) => {
        if(error){
          return reject(error);
        }
        return resolve();
  });
});
}

const ChangeElevatorStatusHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "ChangeElevatorStatusIntent"
    );
  },
  async handle(handlerInput) {
      
    const elevatorIdStatusToChange = handlerInput.requestEnvelope.request.intent.slots.elevatorIdStatusToChange.value;
    const status = handlerInput.requestEnvelope.request.intent.slots.elevatorIdStatusChoice.value;
    const callMethod = await httpPutElevatorStatus(elevatorIdStatusToChange, status);
    // Creating the output speech with the previously declared constants
    const outputSpeech =` The status of elevator id ${elevatorIdStatusToChange} have been changed to ${status}`

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .reprompt()
      .getResponse();
  }
};


async function httpPutElevatorStatus(id, status) {
return new Promise((resolve, reject) =>{
  request({
      uri: "https://floating-citadel-15630.herokuapp.com/api/elevators/"+id,
      method: 'PUT',
      headers: {
          'Content-type': 'application/json'
      },
      body: JSON.stringify({status: status})
    },
    (error, response, body) => {
        if(error){
          return reject(error);
        }
        return resolve();
  });
});
}



const ChangeColumnStatusHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "ChangeColumnStatusIntent"
    );
  },
  async handle(handlerInput) {
      
    const ColumnIdStatusToChange = handlerInput.requestEnvelope.request.intent.slots.ColumnIdStatusToChange.value;
    const statusColumn = handlerInput.requestEnvelope.request.intent.slots.columnIdStatusChoice.value;
    const callMethod = await httpPutColumnStatus(ColumnIdStatusToChange, statusColumn);
    // Creating the output speech with the previously declared constants
    const outputSpeech =` The status of column id ${ColumnIdStatusToChange} have been changed to ${statusColumn}`

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .reprompt()
      .getResponse();
  }
};


async function httpPutColumnStatus(id, statusColumn) {
return new Promise((resolve, reject) =>{
  request({
      uri: "https://floating-citadel-15630.herokuapp.com/api/columns/"+id,
      method: 'PUT',
      headers: {
          'Content-type': 'application/json'
      },
      body: JSON.stringify({status: statusColumn})
    },
    (error, response, body) => {
        if(error){
          return reject(error);
        }
        return resolve();
  });
});
}

const ChangeBatteryStatusHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "ChangeBatteryStatusIntent"
    );
  },
  async handle(handlerInput) {
      
    const BatteryIdStatusToChange = handlerInput.requestEnvelope.request.intent.slots.BatteryIdStatusToChange.value;
    const batteryIdStatusChoice = handlerInput.requestEnvelope.request.intent.slots.batteryIdStatusChoice.value;
    const callMethod = await httpPutBatteryStatus(BatteryIdStatusToChange, batteryIdStatusChoice);
    // Creating the output speech with the previously declared constants
    const outputSpeech =` The status of battery id ${BatteryIdStatusToChange} have been changed to ${batteryIdStatusChoice}`

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .reprompt()
      .getResponse();
  }
};


async function httpPutBatteryStatus(id, batteryIdStatusChoice) {
return new Promise((resolve, reject) =>{
  request({
      uri: "https://floating-citadel-15630.herokuapp.com/api/batteries/"+id,
      method: 'PUT',
      headers: {
          'Content-type': 'application/json'
      },
      body: JSON.stringify({status: batteryIdStatusChoice})
    },
    (error, response, body) => {
        if(error){
          return reject(error);
        }
        return resolve();
  });
});
}









const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can introduce yourself by telling me your name';
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};


const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';
    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};



const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const getRemoteData = function (url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? require('https') : require('http');
    const request = client.get(url, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error('Failed with status code: ' + response.statusCode));
      }
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => resolve(body.join('')));
    });
    request.on('error', (err) => reject(err))
  })
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
      GetWelcomeHandler,
    GetColumnStatusHandler,
    GetInterventionHandler,
    GetCustomerHandler,
    ChangeBatteryStatusHandler,
    ChangeColumnStatusHandler,
    ChangeElevatorStatusHandler,
    ChangeInterventionStatusToCompletedHandler,
    GetBatterieStatusHandler,
    ChangeInterventionStatusToProgressHandler,
    GetElevatorStatusHandler,
    GetAllInformationHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();