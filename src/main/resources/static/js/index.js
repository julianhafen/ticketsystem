// NAVbar Controls
let btnregister = document.querySelector("#register");
let btnlogin = document.querySelector("#login");
let btnticketoverview = document.querySelector("#navticketoverview");
let signin = document.querySelector(".signin");
let login = document.querySelector(".login");
let ticketoverview = document.querySelector(".ticketoverview");
const urlbase="http://localhost:8080/";

let showsignin = () => {
    signin.removeAttribute("hidden");
    login.setAttribute("hidden", true);
    ticketoverview.setAttribute("hidden", true);
    ticketcreation.setAttribute("hidden", true);
    ticketdetail.setAttribute("hidden", true);
    emptyTicketOverview();
}
btnregister.addEventListener("click", () => {
    showsignin();
})

let showlogin = () => {
    signin.setAttribute("hidden", true);
    login.removeAttribute("hidden");
    ticketoverview.setAttribute("hidden", true);
    ticketdetail.setAttribute("hidden", true);
    ticketcreation.setAttribute("hidden", true);
    emptyTicketOverview();
}
btnlogin.addEventListener("click", () => {
    showlogin();
})

let showticketdetail = (id) => {
	emptyTicketOverview();
    signin.setAttribute("hidden",true);
    login.setAttribute("hidden", true);
    ticketdetail.removeAttribute("hidden");
    ticketcreation.setAttribute("hidden", true);
    ticketoverview.setAttribute("hidden", true);
    if (role == "Raumbetreuer") {
    btnchangeticketstate.removeAttribute("hidden");
    } else {
    btnchangeticketstate.setAttribute("hidden", true);
    }
    
    showticket(id);
}

let showticketoverview = (role) => {
	emptyTicketOverview();
    signin.setAttribute("hidden",true);
    login.setAttribute("hidden", true);
    ticketoverview.removeAttribute("hidden");
    ticketcreation.setAttribute("hidden", true);
    ticketdetail.setAttribute("hidden", true);
    getTicketOverview(role);
}
btnticketoverview.addEventListener("click", () => {
    showticketoverview(role);
})

//Sign In
let namesignin = document.querySelector("#namesignin");
let surnamesignin = document.querySelector("#surnamesignin");
let signinemail = document.querySelector("#emailsignin");
let signinpwd = document.querySelector("#pwdsignin");
let rolesignin = document.querySelector("#roleselect");
let btnsubmitsignin = document.querySelector("#submitsignin");
let btnsubmitrooms = document.querySelector("#submitrooms");

btnsubmitsignin.addEventListener("click", () => {
        let user = {};
        user.name = namesignin.value;
        user.surname = surnamesignin.value;
        user.email = signinemail.value;
        user.password = signinpwd.value;
        user.role = rolesignin.value;
        let url = urlbase+"createUser"; // Die URL des Servers
        let options = {}; // HTTP-Header und Options vorbereiten
        options.method = "POST"; // GET/POST/PUT/DELETE
        options.headers = new Headers();
        options.headers.append("Content-Type", "application/json;charset=UTF-8");
        options.body = JSON.stringify(user);
        fetch(url, options) // Daten senden
        .then((response) => {
       // response enthält den Rückgabewert der obigen Java-Methode createTodo()
        });     

        if (rolesignin.value == "Raumbetreuer") {

            let url = urlbase+"getRaeume"; // Die URL des Servers
            fetch(url)
            .then(response => response.json())
            .then((rooms) => {
                let roomdiv = document.querySelector(".room-overview");
                roomdiv.innerHTML = "";
                for (let index = 0; index < rooms.length; index++) {
                    let room = rooms[index];
                    let label = document.createElement("label");
                    roomdiv.appendChild(label);
                    inputelement = document.createElement("input");
                    label.appendChild(inputelement);
                    inputelement.setAttribute("data-id", room.raum_id);
                    inputelement.setAttribute("type", "checkbox");
                    inputelement.classList.add("form-check-input");
                    let text = document.createTextNode(room.beschreibung);
                    label.appendChild(text);
                    let br = document.createElement("br")
                    roomdiv.appendChild(br);
                }
                btnsubmitsignin.setAttribute("hidden", true);
                btnsubmitrooms.removeAttribute("hidden");
            });
        } 
        btnsubmitrooms.addEventListener("click", () => {
            let userroom = {};
            let roomList = [];
            userroom.email = signinemail.value;
            let roomselectList = document.querySelectorAll(".form-check-input")
            for(let i = 0; i < roomselectList.length; i++) {
            if (roomselectList[i].checked) {
            roomList.push(roomselectList[i].getAttribute("data-id"));
            }
            }
            userroom.raeume = roomList;
            let url = urlbase+"createBetreuung"; // Die URL des Servers
            let options = {}; // HTTP-Header und Options vorbereiten
            options.method = "POST"; // GET/POST/PUT/DELETE
            options.headers = new Headers();
            options.headers.append("Content-Type", "application/json;charset=UTF-8");
            options.body = JSON.stringify(userroom);
            fetch(url, options) // Daten senden
            .then((response) => {
           // response enthält den Rückgabewert der obigen Java-Methode createTodo()
           if (response == true) {
            alert("Sie sind nun erfolgreich angelegt.")
            }
            });       
        })
})

//Login
let loginemail = document.querySelector("#emaillogin");
let loginpwd = document.querySelector("#pwdlogin")
let btnsubmitlogin = document.querySelector("#submitlogin");

let getRolle = () => {
    let url = urlbase+"getRolle"; // Die URL des Servers
		fetch(url)
            .then(response => response.text())
            .then((temprole) => {
                role = temprole;
            }); 
}

btnsubmitlogin.addEventListener("click", () => {
    let user = {};
    user.email = loginemail.value;
    user.password = loginpwd.value;
    let url = urlbase+"loginUser"; // Die URL des Servers
    let options = {}; // HTTP-Header und Options vorbereiten
    options.method = "POST"; // GET/POST/PUT/DELETE
    options.headers = new Headers();
    options.headers.append("Content-Type", "application/json;charset=UTF-8");
    options.body = JSON.stringify(user);
	fetch(url, options) // Daten senden
    .then(response => response.text())
    .then((responsetext) => {
	    if (responsetext == "true") {
	        alert("Sie sind nun erfolgreich angemeldet.")
	        getRolle();
	    }
    });   
})


//Ticketoverview
let btnnewticket = document.querySelector("#newticket");
let ticketdetail = document.querySelector(".ticketdetail");
let tablebody = document.querySelector("#tablebody");
let ticketsall = [];

let emptyTicketOverview = () => {
	tablebody.innerHTML = "";
}

let getTicketOverview = (role) => {
if (role == "Lehrer") {
    fetch(urlbase+"getTicketsLehrer")
    .then(response => response.json())
    .then((tickets) => {
    	ticketsall = tickets;
        for (let index = 0; index < tickets.length; index++) {
            let ticket = tickets[index];
            let tablerow = document.createElement("tr")
            tablebody.appendChild(tablerow);
            tablerow.setAttribute("id", index+1);
            let tablehead = document.createElement("th");
            tablerow.appendChild(tablehead);
            tablehead.setAttribute("scope", index+1);
            let tabledata1 = document.createElement("td");
            tablerow.appendChild(tabledata1);
            tabledata1.innerHTML = ticket.titel;
            let tabledata2 = document.createElement("td");
            tablerow.appendChild(tabledata2);
            tabledata2.innerHTML = ticket.raum_id;
            let tabledata3 = document.createElement("td");
            tablerow.appendChild(tabledata3);
            tabledata3.innerHTML = ticket.beschreibung;
            let tabledata4 = document.createElement("td");
            tablerow.appendChild(tabledata4);
            tabledata4.innerHTML = ticket.datum;
            let tabledata5 = document.createElement("td");
            tablerow.appendChild(tabledata5);
            tabledata5.innerHTML = ticket.status;     
        }
    });
    btnnewticket.removeAttribute("hidden");
} else {
	btnnewticket.setAttribute("hidden", true);
    fetch(urlbase+"getTicketsBetreuer")
    .then(response => response.json())
    .then((tickets) => {
    	ticketsall = tickets;
        for (let index = 0; index < tickets.length; index++) {
            let ticket = tickets[index];
            let tablerow = document.createElement("tr")
            tablebody.appendChild(tablerow);
            tablerow.setAttribute("id", index+1);
            let tablehead = document.createElement("th");
            tablerow.appendChild(tablehead);
            tablehead.setAttribute("scope", index+1);
            let tabledata1 = document.createElement("td");
            tablerow.appendChild(tabledata1);
            tabledata1.innerHTML = ticket.titel;
            let tabledata2 = document.createElement("td");
            tablerow.appendChild(tabledata2);
            tabledata2.innerHTML = ticket.raum_id;
            let tabledata3 = document.createElement("td");
            tablerow.appendChild(tabledata3);
            tabledata3.innerHTML = ticket.beschreibung;
            let tabledata4 = document.createElement("td");
            tablerow.appendChild(tabledata4);
            tabledata4.innerHTML = ticket.datum;
            let tabledata5 = document.createElement("td");
            tablerow.appendChild(tabledata5);
            tabledata5.innerHTML = ticket.status;
        }
        trslisten();
    });
}

let trslisten = () => {
function clickHandler() {
    // Here, `this` refers to the element the event was hooked on
    showticketdetail(this.getAttribute("id"));
}
	let trs = document.querySelectorAll("#tickettable tr")
		for (let i = 0; i < trs.length; i++){
			trs[i].addEventListener("click", clickHandler);
		}
		//.forEach(e => e.addEventListener("click", clickHandler));
	}


}

//Ticketcreation
let ticketcreation = document.querySelector(".ticketcreation");

btnnewticket.addEventListener("click", () => {
    ticketoverview.setAttribute("hidden", true);
    ticketcreation.removeAttribute("hidden");
    let roomselect = document.querySelector("#roomselect");
    let option = document.createElement("option");
    let url = urlbase+"getRaeume"; // Die URL des Servers
	fetch(url)
    .then(response => response.json())
    .then((rooms) => { 
        for (let index = 0; index < rooms.length; index++) {
            let room = rooms[index];
            let option = document.createElement("option");
            roomselect.appendChild(option);
            option.setAttribute("data-id", room.raum_id)
            option.setAttribute("id", "ticketroomoption")
            option.innerHTML = room.beschreibung;
	        }
	    });
	})
	
	let title = document.querySelector("#title");
	let description = document.querySelector("#description");
	let selectedroom = document.querySelector("#roomselect");
	let btncreateticket = document.querySelector("#submitticket");
	btncreateticket.addEventListener("click", () => {
    let ticket = {};
    let room = selectedroom.options[selectedroom.selectedIndex].getAttribute("data-id");
    ticket.raum_id = room;
    ticket.beschreibung = description.value;
    ticket.titel = title.value;
    let url = urlbase+"createTicket"; // Die URL des Servers
    let options = {}; // HTTP-Header und Options vorbereiten
    options.method = "POST"; // GET/POST/PUT/DELETE
    options.headers = new Headers();
    options.headers.append("Content-Type", "application/json;charset=UTF-8");
    options.body = JSON.stringify(ticket);
    fetch(url, options) // Daten senden
    .then(response => response.text())
    .then((responsetext) => {
        if (responsetext == "true") {
            alert("Ihr Ticket wurde erfolgreich angelegt.")
            showticketoverview();
        }
    }); 
})

//Ticketdetails
let btnchangeticketstate = document.querySelector("#submitstatechange");
let stateselection = document.querySelector("#stateselection");
    
    let showticket = (id) => {
    let ticketdetailtemp = ticketsall[id];
    let title = document.querySelector("#lbltitle");
    let creator = document.querySelector("#lblcreator");
    let room = document.querySelector("#lblroom");
    let description = document.querySelector("#lbldescription");
    let date = document.querySelector("#lbldate");
    let state = document.querySelector("#lblstate");
    let titletxt = document.createTextNode(ticketdetailtemp.titel);
    let creatortxt = document.createTextNode(ticketdetailtemp.user_id);
    let roomtxt = document.createTextNode(ticketdetailtemp.raum_id);
    let descriptiontxt = document.createTextNode(ticketdetailtemp.beschreibung);
    let datetxt = document.createTextNode(ticketdetailtemp.datum);
    let statetxt = document.createTextNode(ticketdetailtemp.status);
    creator.appendChild(creatortxt);
    room.appendChild(roomtxt);
    description.appendChild(descriptiontxt);
    date.appendChild(datetxt);
    state.appendChild(statetxt); 
}
