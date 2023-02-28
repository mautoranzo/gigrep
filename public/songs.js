async function buildSongsTable(songsTable, songsTableHeader, token, message) {
    try {
        const response = await fetch("/api/v1/gigrep/song", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        var children = [songsTableHeader];
        if (response.status === 200) {
            if (data.count === 0) {
                songsTable.replaceChildren(...children); // clear this for safety
                return 0;
            } else {
                for (let i = 0; i < data.songs.length; i++) {
                    let editButton = `<td><button type="button" class="editButtonSong" data-id=${data.songs[i]._id}>edit</button></td>`;
                    let deleteButton = `<td><button type="button" class="deleteButtonSong" data-id=${data.songs[i]._id}>delete</button></td>`;
                    let rowHTML = `
                    <td><a href="${data.songs[i].chords}" target="_blank">${data.songs[i].songName}</a></td>
                    <td>${data.songs[i].author}</td>
                    <td>${data.songs[i].key}</td>
                    <td>${data.songs[i].firstChord}</td>
                    <td>${data.songs[i].capo}</td>
                    <td>${data.songs[i].bpm}</td>
                    <td>${data.songs[i].system}</td>
                    <td><a href="${data.songs[i].link}" target="_blank">${data.songs[i].songName}</a></td>
                    ${editButton}${deleteButton}`;
                    let rowEntry = document.createElement("tr");
                    rowEntry.innerHTML = rowHTML;
                    children.push(rowEntry);
                }
                songsTable.replaceChildren(...children);
            }
            return data.count;
        } else {
            message.textContent = data.msg;
            return 0;
        }
    } catch (err) {
        message.textContent = "A communication error occurred.";
        return 0;
    }
}

async function buildGigsTable(gigsTable, gigsTableHeader, token, message) {
    try {
        const response = await fetch("/api/v1/gigrep/gig", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        var children = [gigsTableHeader];
        if (response.status === 200) {
            if (data.count === 0) {
                gigsTable.replaceChildren(...children); // clear this for safety
                return 0;
            } else {
                for (let i = 0; i < data.gigs.length; i++) {
                    let editButton = `<td><button type="button" class="goToGigButton" data-id=${data.gigs[i]._id}>Go to Gig</button></td>`;
                    let deleteButton = `<td><button type="button" class="deleteButtonGig" data-id=${data.gigs[i]._id}>delete</button></td>`;
                    let rowHTML = `
                    <td>${data.gigs[i].gigName}</td>
                    ${editButton}${deleteButton}`;
                    let rowEntry = document.createElement("tr");
                    rowEntry.innerHTML = rowHTML;
                    children.push(rowEntry);
                }
                gigsTable.replaceChildren(...children);
            }
            return data.count;
        } else {
            message.textContent = data.msg;
            return 0;
        }
    } catch (err) {
        message.textContent = "A communication error occurred.";
        return 0;
    }
}

async function buildGigSongsTable(edit, gigId, editGigSongsTable, editGigSongsTableHeader, token, message) {
    try {
        const response = await fetch("/api/v1/gigrep/song", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        var children = [editGigSongsTableHeader];
        if (response.status === 200) {
            if (data.count === 0) {
                editGigSongsTable.replaceChildren(...children); // clear this for safety
                return 0;
            } else {
                for (let i = 0; i < data.songs.length; i++) {
                    if(!edit){
                        if (data.songs[i].gigs.some(gig => gig===gigId)){
                            let rowHTML = `
                            <td><a href="${data.songs[i].chords}" target="_blank">${data.songs[i].songName}</a></td>
                            <td>${data.songs[i].key}</td>
                            <td>${data.songs[i].firstChord}</td>
                            <td>${data.songs[i].capo}</td>
                            <td>${data.songs[i].bpm}</td>
                            <td><a href="${data.songs[i].link}" target="_blank">${data.songs[i].songName}</a></td>
                            `;
                            let rowEntry = document.createElement("tr");
                            rowEntry.innerHTML = rowHTML;
                            children.push(rowEntry);
                        }
                    } else{
                        // console.log("before stringify", data.songs[i]);
                        let info = JSON.stringify(data.songs[i]).replaceAll(' ', '*')
                        // console.log("after stringify", info);
                        let addRemoveBtn
                        data.songs[i].gigs.some(gig => gig===gigId)?
                        addRemoveBtn = `<td><button type="button" class="removeFromGigBtn" data-info=${info} data-action="remove">Remove</button></td>`:
                        addRemoveBtn = `<td> <button type="button" class="addToGigBtn" data-info=${info} data-action="add">Add</button></td>`
                        let rowHTML = `
                        <td>${data.songs[i].songName}</td>
                        <td>${data.songs[i].author}</td>
                        ${addRemoveBtn}`;
                        let rowEntry = document.createElement("tr");
                        rowEntry.innerHTML = rowHTML;
                        children.push(rowEntry);
                    }                
                }
                editGigSongsTable.replaceChildren(...children);
            }
            return data.count;
        } else {
            message.textContent = data.msg;
            return 0;
        }
    } catch (err) {
        message.textContent = "A communication error occurred.";
        return 0;
    }
}

let showing
document.addEventListener("DOMContentLoaded", () => {
    const logoff = document.getElementById("logoff");
    const message = document.getElementById("message");
    const logonRegister = document.getElementById("logon-register");
    const logon = document.getElementById("logon");
    const register = document.getElementById("register");
    const logonDiv = document.getElementById("logon-div");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const logonButton = document.getElementById("logon-button");
    const logonCancel = document.getElementById("logon-cancel");
    const registerDiv = document.getElementById("register-div");
    const name = document.getElementById("name");
    const email1 = document.getElementById("email1");
    const password1 = document.getElementById("password1");
    const password2 = document.getElementById("password2");
    const registerButton = document.getElementById("register-button");
    const registerCancel = document.getElementById("register-cancel");
    const songs = document.getElementById("songs");
    const songsTable = document.getElementById("songs-table");
    const songsTableHeader = document.getElementById("songs-table-header");
    const addSong = document.getElementById("add-song");
    const editSong = document.getElementById("edit-song");
    const songName = document.getElementById("songName");
    const chords = document.getElementById("chords")
    const author = document.getElementById("author");
    const key = document.getElementById("key");
    const firstChord = document.getElementById("firstChord");
    const capo = document.getElementById("capo");
    const bpm = document.getElementById("bpm");
    const system = document.getElementById("system");
    const link = document.getElementById("link");
    const addingSong = document.getElementById("adding-song");
    const songsMessage = document.getElementById("songs-message");
    const editCancel = document.getElementById("edit-cancel");
    //gigs
    const gigrep = document.getElementById("gigrep")
    const gig = document.getElementById("gig");
    const gigTitle = document.getElementById("gig-title")
    const gigsTable = document.getElementById("gigs-table");
    const gigsTableHeader = document.getElementById("gigs-table-header");
    const addGig = document.getElementById("add-gig");
    const editGig = document.getElementById("edit-gig");
    const gigName = document.getElementById("gigName");
    const addingGig = document.getElementById("adding-gig");
    const editCancelGig = document.getElementById("edit-cancel-gig");

    const addSongsToGig = document.getElementById("add-songs-to-gig")
    const gigsMessage = document.getElementById("gigs-message");
    const editSongsGig = document.getElementById("edit-songs-gig")
    const backToMainMenu = document.getElementById("back-to-main-menu")
    const gigSongsTable = document.getElementById("gig-songs-table");
    const gigSongsTableHeader = document.getElementById("gig-songs-table-header");
    const editGigSongsTable = document.getElementById("edit-gig-songs-table");
    const editGigSongsTableHeader = document.getElementById("edit-gig-songs-table-header");
    // section 2 
    showing = logonRegister;
    let token = null;
    document.addEventListener("startDisplay", async () => {
        token = localStorage.getItem("token");
        if (showing === editGig || showing === gig) {
            if(showing === editGig){
                await buildGigSongsTable(
                    true,
                    editGig.dataset.id,
                    editGigSongsTable,
                    editGigSongsTableHeader,
                    token,
                    message
                );
            } else{
                await buildGigSongsTable(
                    false,
                    editGig.dataset.id,
                    gigSongsTable,
                    gigSongsTableHeader,
                    token,
                    message
                );
            }
        }
        else{
            showing = logonRegister;
            if (token) {
            //if the user is logged in
                logoff.style.display = "block";
                const songsCount = await buildSongsTable(
                    songsTable,
                    songsTableHeader,
                    token,
                    message
                );
                if (songsCount > 0) {
                    songsMessage.textContent = "";
                    songsTable.style.display = "block";
                } else {
                    songsMessage.textContent = "There are no songs to display for this user.";
                    songsTable.style.display = "none";
                }
                const gigsCount = await buildGigsTable(
                    gigsTable,
                    gigsTableHeader,
                    token,
                    message
                );
                if (gigsCount > 0) {
                    gigsMessage.textContent = "";
                    gigsTable.style.display = "block";
                } else {
                    gigsMessage.textContent = "There are no gigs to display for this user.";
                    gigsTable.style.display = "none";
                }
                gigrep.style.display = "block";
                showing = gigrep;
            } else {
                logonRegister.style.display = "block";
            }
        }
    });

    var thisEvent = new Event("startDisplay");
    document.dispatchEvent(thisEvent);
    var suspendInput = false;
  // section 3
    document.addEventListener("click", async (e) => {
        if (suspendInput) {
            return; // we don't want to act on buttons while doing async operations
        }
        if (e.target.nodeName === "BUTTON") {
        message.textContent = "";
        }
        if (e.target === logoff) {
            logoff.style.display = "none"
            localStorage.removeItem("token");
            token = null;
            showing.style.display = "none";
            logonRegister.style.display = "block";
            showing = logonRegister;
            songsTable.replaceChildren(songsTableHeader); // don't want other users to see
            editGigSongsTable.replaceChildren(editGigSongsTableHeader)
            message.textContent = "You are logged off.";
        } else if (e.target === logon) {
            showing.style.display = "none";
            logonDiv.style.display = "block";
            showing = logonDiv;
        } else if (e.target === register) {
            showing.style.display = "none";
            registerDiv.style.display = "block";
            showing = registerDiv;
        } else if (e.target === logonCancel || e.target == registerCancel) {
            showing.style.display = "none";
            logonRegister.style.display = "block";
            showing = logonRegister;
            email.value = "";
            password.value = "";
            name.value = "";
            email1.value = "";
            password1.value = "";
            password2.value = "";
        } else if (e.target === logonButton) {
            suspendInput = true;
            try {
                const response = await fetch("/api/v1/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.value,
                    password: password.value,
                }),
                });
                const data = await response.json();
                if (response.status === 200) {
                    message.textContent = `Logon successful.  Welcome ${data.user.name}`;
                    token = data.token;
                    localStorage.setItem("token", token);
                    showing.style.display = "none";
                    thisEvent = new Event("startDisplay");
                    email.value = "";
                    password.value = "";
                    document.dispatchEvent(thisEvent);
                } else {
                    message.textContent = data.msg;
                }
            } catch (err) {
                message.textContent = "A communications error occurred.";
            }
            suspendInput = false;
        } else if (e.target === registerButton) {
            if (password1.value != password2.value) {
                message.textContent = "The passwords entered do not match.";
            } else {
                suspendInput = true;
                try {
                const response = await fetch("/api/v1/auth/register", {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                    name: name.value,
                    email: email1.value,
                    password: password1.value,
                    }),
                });
                const data = await response.json();
                if (response.status === 201) {
                    message.textContent = `Registration successful.  Welcome ${data.user.name}`;
                    token = data.token;
                    localStorage.setItem("token", token);
                    showing.style.display = "none";
                    thisEvent = new Event("startDisplay");
                    document.dispatchEvent(thisEvent);
                    name.value = "";
                    email1.value = "";
                    password1.value = "";
                    password2.value = "";
                } else {
                    message.textContent = data.msg;
                }
                } catch (err) {
                message.textContent = "A communications error occurred.";
                }
                suspendInput = false;
            }
        } 
        // section 4
        else if (e.target === addSong) {
            showing.style.display = "none";
            editSong.style.display = "block";
            showing = editSong;
            delete editSong.dataset.id;
            // songName.value = "";
            // chords.value = ""
            // author.value = "";
            key.value = "C";
            // firstChord.value = key.value
            // capo.value = ""
            // bpm.value = ""
            // system.value = ""
            // link.value = ""
            addingSong.textContent = "add";
        } else if (e.target === editCancel) {
            showing.style.display = "none";
            songName.value = "";
            chords.value = "";
            author.value = "";
            key.value = "C";
            firstChord.value = key.value
            capo.value =""
            bpm.value = ""
            system.value = ""
            link.value = ""
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
        } else if (e.target === addingSong) {
            if (!editSong.dataset.id) {
              // this is an attempted to add SONGS TO REP
                suspendInput = true;
                    try {
                        const response = await fetch("/api/v1/gigrep/song", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                songName: songName.value,
                                chords: chords.value,
                                author: author.value,
                                key: key.value,
                                firstChord: firstChord.value,
                                capo: capo.value ,
                                bpm: bpm.value,
                                system: system.value,
                                link: link.value
                            }),
                        });
                        const data = await response.json();
                        if (response.status === 201) {
                            //successful create
                            message.textContent = "The song entry was created.";
                            showing.style.display = "none";
                            thisEvent = new Event("startDisplay");
                            document.dispatchEvent(thisEvent);
                            songName.value = "";
                            chords.value = "";
                            author.value = "";
                            key.value = "C";
                            firstChord.value = key.value
                            capo.value = ""
                            bpm.value = ""
                            system.value = ""
                            link.value = ""
                        } else {
                        // failure
                            message.textContent = data.msg;
                        }
                } catch (err) {
                    message.textContent = "A communication error occurred.";
                }
                suspendInput = false;
            } else {
              // this is an update SONG OF REP
                suspendInput = true;
                try {
                    const songID = editSong.dataset.id;
                    const response = await fetch(`/api/v1/gigrep/song/${songID}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            songName: songName.value,
                            chords: chords.value,
                            author: author.value,
                            key: key.value,
                            firstChord: firstChord.value,
                            capo: capo.value,
                            bpm: bpm.value,
                            system: system.value,
                            link: link.value
                        }),
                    });
                    const data = await response.json();
                    if (response.status === 200) {
                        message.textContent = "The song entry was updated.";
                        showing.style.display = "none";
                        songName.value = "";
                        chords.value = "";
                        author.value = "";
                        key.value = "C";
                        firstChord.value = key.value
                        capo.value = ""
                        bpm.value = ""
                        system.value = ""
                        link.value = ""
                        thisEvent = new Event("startDisplay");
                        document.dispatchEvent(thisEvent);
                    } else {
                        message.textContent = data.msg;
                    }
                } catch (err) {
                    message.textContent = "A communication error occurred.";
                }
            }
            suspendInput = false;
        } 
        //THIS SEND TO EDIT SONG VIEW=NEW SONG VIEW 
        else if (e.target.classList.contains("editButtonSong")) {
            editSong.dataset.id = e.target.dataset.id;
            suspendInput = true;
            try {
                const response = await fetch(`/api/v1/gigrep/song/${e.target.dataset.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (response.status === 200) {
                    songName.value = data.song.songName;
                    chords.value = data.song.chords;
                    author.value = data.song.author;
                    key.value = data.song.key;
                    firstChord.value = data.song.firstChord
                    capo.value = data.song.capo
                    bpm.value = data.song.bpm
                    system.value = data.song.system
                    link.value = data.song.link
                    showing.style.display = "none";
                    showing = editSong;
                    showing.style.display = "block";
                    addingSong.textContent = "update";
                    message.textContent = "";
                } else {
                    // might happen if the list has been updated since last display
                    message.textContent = "The song entry was not found";
                    thisEvent = new Event("startDisplay");
                    document.dispatchEvent(thisEvent);
                }
            } catch (err) {
                message.textContent = "A communications error has occurred.";
            }
            suspendInput = false;
        }
        //DELETE SONG from REP
        else if (e.target.classList.contains("deleteButtonSong")) {
            suspendInput = true;
            try {
                const response = await fetch(`/api/v1/gigrep/song/${e.target.dataset.id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (response.status === 200) {
                    message.textContent = data.msg;
                    showing.style.display = "none";
                    thisEvent = new Event("startDisplay");
                    document.dispatchEvent(thisEvent);
                } else {
                    // might happen if the list has been updated since last display
                    message.textContent = "The songs entry was not found";
                    thisEvent = new Event("startDisplay");
                    document.dispatchEvent(thisEvent);
                }
            } catch (err) {
                message.textContent = "A communications error has occurred.";
            }
            suspendInput = false;
        }
        //CRUD op for Gigs
        
        //ADD A NEW GIG VIEW = EDIT GIG VIEW
        else if (e.target === addGig||e.target === addSongsToGig) {
            showing.style.display = "none";
            editGig.style.display = "block";
            showing = editGig;
            if(e.target === addGig){
                editGig.dataset.new = true
                suspendInput = true;
                try {
                    const response = await fetch("/api/v1/gigrep/gig", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            gigName: "New Gig",
                        }),
                    });
                    const data = await response.json();
                    if (response.status === 201) {
                        //successfully created
                        editGig.dataset.id = data.gig._id
                        message.textContent = "Add songs to your gig";
                        gigName.value = "New Gig";
                    } else {
                    // failure
                        message.textContent = data.msg;
                    }
                } catch (err) {
                    message.textContent = "A communication error occurred.";
                }
                suspendInput = false;            
            } else{
                gigName.value = editGig.dataset.gigName;
            }
            const gigSongsCount = await buildGigSongsTable(
                true,
                editGig.dataset.id,
                editGigSongsTable,
                editGigSongsTableHeader,
                token,
                message
            );
            if (gigSongsCount > 0) {
                songsMessage.textContent = "";
                songsTable.style.display = "block";
            } else {
                songsMessage.textContent = "There are no songs to display for this user.";
                songsTable.style.display = "none";
            }
        } else if (e.target === editCancelGig && !editGig.dataset.new) {
            showing.style.display = "none";
            showing = gig;
            showing.style.display = "block";
            gigName.value = "";
        } else if (e.target === addingGig) {
            delete editGig.dataset.new
            suspendInput = true;
                try {
                    const response = await fetch(`/api/v1/gigrep/gig/${editGig.dataset.id}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            gigName: gigName.value,
                        }),
                    });
                    const data = await response.json();
                    if (response.status === 200) {
                        //successful EDIT
                        showing.style.display = "none";
                        showing = gig;
                        showing.style.display = "block";
                        message.textContent = "The gig entry was saved.";
                        gigTitle.textContent = gigName.value;
                        gigName.value = "";
                        thisEvent = new Event("startDisplay");
                        document.dispatchEvent(thisEvent);    
                    } else {
                    // failure
                        message.textContent = data.msg;
                    }
            } catch (err) {
                message.textContent = "A communication error occurred.";
            }
            suspendInput = false;
        }
        
        // section 5
        
        //Go to GIG VIEW OR AFTER SAVING CHANGES IN GIG EDITION
        
        else if (e.target.classList.contains("goToGigButton")) {
            editGig.dataset.id = e.target.dataset.id;
            suspendInput = true;
            try {
                const response = await fetch(`/api/v1/gigrep/gig/${editGig.dataset.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                editGig.dataset.gigName = data.gig.gigName;
                if (response.status === 200) {
                    gigTitle.textContent = data.gig.gigName;
                    await buildGigSongsTable(
                        false,
                        editGig.dataset.id,
                        gigSongsTable,
                        gigSongsTableHeader,
                        token,
                        message
                    );
                    showing.style.display = "none";
                    showing = gig;
                    showing.style.display = "block";
                    message.textContent = "";
                } else {
                    // might happen if the list has been updated since last display
                    message.textContent = "The gig entry was not found";
                    thisEvent = new Event("startDisplay");
                    document.dispatchEvent(thisEvent);
                }
            } catch (err) {
                message.textContent = "A communications error has occurred.";
            }
            suspendInput = false;
        } else if (e.target === backToMainMenu) {
            delete editGig.dataset.id
            showing.style.display = "none";
            gigTitle.textContent = "";
            showing = logonRegister;
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
        }
        
        //DELETE GIG
        else if (e.target.classList.contains("deleteButtonGig")||(e.target === editCancelGig && editGig.dataset.new)) {
            suspendInput = true;
            let ID
            e.target.classList.contains("deleteButtonGig")? ID = e.target.dataset.id : ID = editGig.dataset.id
            try {
                const response = await fetch(`/api/v1/gigrep/gig/${ID}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (response.status === 200) {
                    if(editGig.dataset.new){
                        delete editGig.dataset.new
                        delete  editGig.dataset.id
                    } else{
                        message.textContent = data.msg;
                    }
                    showing.style.display = "none";
                    showing = "nada"
                    thisEvent = new Event("startDisplay");
                    document.dispatchEvent(thisEvent);
                } else {
                    // might happen if the list has been updated since last display
                    message.textContent = "The gig entry was not found";
                    thisEvent = new Event("startDisplay");
                    document.dispatchEvent(thisEvent);
                }
            } catch (err) {
                message.textContent = "A communications error has occurred.";
            }
            suspendInput = false;
        }
        //AGREGANDO O QUITANDO CANCIONES DE GIG
        else if (e.target.classList.contains("addToGigBtn")||e.target.classList.contains("removeFromGigBtn")) {
            let info = e.target.dataset.info.replaceAll('*', ' ')
            info = JSON.parse(info)
            let gigs 
            let msg
            if(e.target.dataset.action==="remove"){
                gigs = info.gigs.filter(gig => gig!==editGig.dataset.id)
                msg = "Song removed from gig"
            } else {
                gigs = [...info.gigs,editGig.dataset.id]
                msg = "Song added to gig"
            }
            suspendInput = true;
            try {
                const response = await fetch(`/api/v1/gigrep/song/${info._id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        gigs: [...gigs],
                        songName: info.songName,
                        key: info.key
                    })
                });
                if (response.status === 200) {
                    message.textContent = msg;
                    thisEvent = new Event("startDisplay");
                    document.dispatchEvent(thisEvent);
                } else {
                    message.textContent = "The songs entry was not found";
                    thisEvent = new Event("startDisplay");
                    document.dispatchEvent(thisEvent);
                }
            } catch (err) {
                message.textContent = "A communications error has occurred.";
            }
            suspendInput = false;
        }
    })
});