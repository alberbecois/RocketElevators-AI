const axios = require("axios");

/*-----------------------------------------------------------------------------*/

//GET ELEVATOR STATUS WITH ID
function getStatus(ID) {
    return axios
        .get(
            `http://floating-citadel-15630.herokuapp.com/api/elevators/get/status/${ID}`
        )
        .then(function (response) {
            // handle success
            console.log(response.data);
            const status = response.data[0].status;
            console.log(`The elevator status is currently "${status}"`);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
}

// getStatus(1);

/*------------------------------------------------------------------------------*/

//GET ALL PENDING INTERVENTIONS
function getInterventionPending() {
    return axios
        .get(
            `http://floating-citadel-15630.herokuapp.com/api/interventions/pending`
        )
        .then(function (response) {
            var array = [];
            for (var i = 0; i < response.data.length; i++) {
                var intervention_id = response.data[i].id;
                array.push(intervention_id);
                var result = response.data[i].result;
                var status = response.data[i].status;
            }
            console.log(
                "Intervention ID number: " +
                array.join(",") +
                ` are currently "${result}" and "${status}".`
            );
        });
}

// getInterventionPending();

/*--------------------------------------------------------------------------------*/

//GET INTERVENTION STATUS
function getIntStatus(id) {
    return axios
        .get(`http://floating-citadel-15630.herokuapp.com/api/interventions/${id}`)
        .then(function (response) {
            console.log(response.data);
            const status = response.data.status;
            console.log(`Intervention #${id} is currently "${status}"`);
        })
        .catch(function (error) {
            // handle error
            console.log("Sorry it doesn't exist");
        })
        .then(function () {
            // always executed
        });
}

// getIntStatus(1000);

/*--------------------------------------------------------------------------------*/

//CHANGE INTERVENTION STATUS TO COMPLETED
function changeIntStatus(id) {
    return axios
        .get(`http://floating-citadel-15630.herokuapp.com/api/interventions/${id}`)
        .then(function (result) {
            console.log(result.data);
            const status = result.data.status;
            console.log(`Intervention #${id} is currently "${status}"`);

            return axios
                .put(
                    `https://floating-citadel-15630.herokuapp.com/api/interventions/${id}/completed`
                )
                .then(function (response) {
                    console.log(response.data);

                    return axios
                        .get(
                            `http://floating-citadel-15630.herokuapp.com/api/interventions/${id}`
                        )
                        .then(function (result) {
                            console.log(result.data);
                            const status = result.data.status;
                            console.log(`Intervention #${id} is currently "${status}"`);
                        });
                });
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
}

// changeIntStatus(6);

/*--------------------------------------------------------------------------------*/

// Change Intervention status to: IN PROGRESS
function changeIntToInProgress(id) {
    return axios
        .get(`http://floating-citadel-15630.herokuapp.com/api/interventions/${id}`)
        .then(function (result) {
            console.log(result.data);
            console.log(result.data.status);
            const wasStatus = result.data.status;

            return axios
                .put(
                    `https://floating-citadel-15630.herokuapp.com/api/interventions/${id}/inProgress`
                )
                .then(function (response) {
                    console.log(response.data);
                    return axios
                        .get(
                            `http://floating-citadel-15630.herokuapp.com/api/interventions/${id}`
                        )
                        .then(function (result) {
                            console.log(result.data);
                            const status = result.data.status;
                            const start_time = result.data.intervention_start_time;
                            console.log(
                                `Intervention #${id}'s has been changed from "${wasStatus}" to "${status}" at ${start_time}.`
                            );
                        });
                });
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
}
// changeIntToInProgress(14);

/*--------------------------------------------------------------------------------*/
//GET THE LIST OF ALL INTERVENTIONS + STATUS + TIME
function listAllInterventions() {
    var myObj, id, startTime, report, result, status, endTime;
    return axios
        .get(`http://floating-citadel-15630.herokuapp.com/api/interventions/`)
        .then(function (response) {
            myObj = response.data;

            for (var i = 0; i < response.data.length; i++) {
                id = myObj[i].id;
                startTime = myObj[i].intervention_start_time;
                report = myObj[i].report;
                result = myObj[i].result;
                status = myObj[i].status;
                endTime = myObj[i].intervention_end_time;

                console.log(
                    `Intervention # ${id}'s started at ${startTime}, reporting "${report}", with the result "${result}", and status of "${status}". The end time for this intervention: "${endTime}"`
                );
            }
        })
        .catch(function (error) {
            // handle error
            console.log("Sorry it doesn't exist");
        })
        .then(function () {
            // always executed
        });
}

// listAllInterventions();

/*--------------------------------------------------------------------------------*/
// RESPOND WITH BRIEF WHEN USER SAYS HI
function welcome() {
    console.log("GREETINGS!");
    return axios
        .get(
            "http://floating-citadel-15630.herokuapp.com/api/elevators/get/status/all"
        )
        .then(function (response) {
            // handle success
            const elevators = response.data.length;

            return axios
                .get("http://floating-citadel-15630.herokuapp.com/api/buildings/")
                .then(function (response) {
                    const buildings = response.data.length;

                    return axios
                        .get("http://floating-citadel-15630.herokuapp.com/api/customers")
                        .then(function (response) {
                            const customers = response.data.length;

                            return axios
                                .get(
                                    "http://floating-citadel-15630.herokuapp.com/api/elevators/get/status/inactive"
                                )
                                .then(function (response) {
                                    const inactiveElevators = response.data.length;

                                    return axios
                                        .get(
                                            "http://floating-citadel-15630.herokuapp.com/api/elevators/get/status/intervention"
                                        )
                                        .then(function (response) {
                                            const interventionElevators = response.data.length;

                                            return axios
                                                .get(
                                                    "http://floating-citadel-15630.herokuapp.com/api/batteries/"
                                                )
                                                .then(function (response) {
                                                    const batteries = response.data.length;

                                                    return axios
                                                        .get(
                                                            "http://floating-citadel-15630.herokuapp.com/api/addresses/city"
                                                        )
                                                        .then(function (response) {
                                                            const cities = response.data.length;

                                                            return axios
                                                                .get(
                                                                    "http://floating-citadel-15630.herokuapp.com/api/quotes"
                                                                )
                                                                .then(function (response) {
                                                                    const quotes = response.data.length;

                                                                    return axios
                                                                        .get(
                                                                            "http://floating-citadel-15630.herokuapp.com/api/leads"
                                                                        )
                                                                        .then(function (response) {
                                                                            const leads = response.data.length;

                                                                            console.log(
                                                                                `There are ${elevators} elevators deployed in ${buildings} buildings of your ${customers} customers. Currently, ${
                                                                                inactiveElevators +
                                                                                interventionElevators
                                                                            } elevators are not in "Running Status" and are being serviced. ${batteries} batteries are deployed across ${cities} cities. On another note you currently have ${quotes} quotes awaiting processing. You also have ${leads} leads in your contact requests.`
                                                                            );
                                                                        });
                                                                });
                                                        });
                                                });
                                        });
                                });
                        });
                });
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
}

welcome();