import { statsMatch } from "./obj.js"
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, setDoc, deleteDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyBv97v1rZHZ78yjmYkg7Kub5ZnIa6OhHnU",
    authDomain: "basketstats-dc373.firebaseapp.com",
    projectId: "basketstats-dc373",
    storageBucket: "basketstats-dc373.appspot.com",
    messagingSenderId: "989572863188",
    appId: "1:989572863188:web:25a6206c08c607f7aa5741"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)

console.log(auth);

document.body.addEventListener('touchmove', (e) => {
    e.preventDefault()
}, { passive: false })

function registrarUsuario(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user
            console.log('usuario registrado: ', user);
        })
        .catch(error => {
            const errorCode = error.errorCode
            const errorMessage = error.message
            console.error('error al registrar: ', errorCode, errorMessage)
        })
}

function iniciarSesion(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            const user = userCredential.user
            console.log('sesion iniciada: ', user);
            
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error al iniciar sesión:", errorCode, errorMessage);
        })
}
iniciarSesion('jeronimocomaschi05@gmail.com', 'Jer0,schi')

function cerrarSesion() {
    signOut(auth).then(() => {
        console.log('sesion cerrada');
    }).catch(error => {
        console.error("Error al cerrar sesión:", error);
    })
}

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault()

    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    registrarUsuario(email, password)
})

let currentUserId
let partidosUser = []

onAuthStateChanged(auth, user => {
    console.log(user);
    
    
    if (user) {
        currentUserId = user.uid
        
        const userDocRef = doc(db, 'users', currentUserId)
        getDoc(userDocRef).then(docSnap => {
            if (docSnap.exists()) {
                console.log('ya existen documentos');
                
                partidosUser = docSnap.data().partidos || []
                console.log('partidos cargados', partidosUser);
                
            } else {
                setDoc(userDocRef, {
                    email: user.email,
                    partidos: []
                }).then(() => {
                    console.log('datos guardados: ', currentUserId);
                    
                }).catch((e) => {
                    console.error(e)
                })

            }
        }).catch(e => {
            console.error(e)
        })
    } 
})

function guardarObjetoLocal() {
    localStorage.setItem('statsMatch', JSON.stringify(statsMatch))
}

function cargarObjetoLocal() {
    
    const savedData = localStorage.getItem('statsMatch')
    const dataJSON = JSON.parse(savedData)
    if (savedData) {
        Object.assign(statsMatch, structuredClone(dataJSON))
        pintarPuntosCuartos()
        pintarStatsCuartos()
        pintarStatsGlobal()
        pointsLocalHTML.innerText = statsMatch.local.global.points
        pointsVisitHTML.innerText = statsMatch.visit.global.points
    }
}

window.onload = cargarObjetoLocal
window.addEventListener('beforeunload', () => {
    if (localStorage.getItem('statsMatch')) {
        localStorage.setItem('statsMatch', JSON.stringify(statsMatch));
    }
})

async function createMatch(statsMatch) {
    
    const userDocRef = doc(db, 'users', currentUserId)
    console.log(userDocRef);
    
    updateDoc(userDocRef, {
        'partidos': arrayUnion(statsMatch)
    }).then(() => {
        console.log('partido guardado con exito');
        return '10'
    }).catch(e => {
        console.error(e)
    })
}

// async function updateMatch(matchId, matchData) {
//     const userDocRef = doc(db, 'users', currentUserId)

//     updateDoc(userDocRef, {
//         partidos[partidos.length]: 
//     })

//     const docRef = doc(getFirestore(), 'partidos', matchId)

//     try {
//         await setDoc(docRef, matchData)
//         console.log('se actualizo el partido');
        
//     } catch (error) {
//         console.error(error)
//     }
// }



async function getAllMatch() {
    const querySnapshot = await getDocs(collection(db, 'partidos'))
    querySnapshot.forEach(doc => {
        const id = doc.id
        const data = doc.data()
        console.log(id);
        console.log(data);
        
    })
    
}

// getAllMatch()

async function getMatch(idMatch) {
    const docRef = doc(db, 'partidos', idMatch)
    console.log(idMatch);
    

    try {
        const data = await getDoc(docRef)
        return data.data()
    } catch (error) {
        console.error(error)
    }
}

async function deleteMatch(idMatch) {
    const docRef = doc(db,'partidos', idMatch)

    try {
        await deleteDoc(docRef)
        console.log('se elimino el partido correctamente');
        
    } catch (error) {
        console.error(error)
    }
}


async function deleteAllMatch() {
    const matchsRef = collection(db, 'partidos')

    try {
        const matchs = await getDocs(matchsRef)

        matchs.forEach(async (match) => {
            await deleteMatch(match.id)
        })
    } catch (error) {
        
    }
}

const buttonsCleanLocal = document.querySelectorAll('.button-clean-local')
const buttonsCleanVisit = document.querySelectorAll('.button-clean-visit')
const buttonsMissLocal = document.querySelectorAll('.button-miss-local')
const buttonsMissVisit = document.querySelectorAll('.button-miss-visit')
const buttonsGralLocal = document.querySelectorAll('.button-gral-stats-local')
const buttonsGralVisit = document.querySelectorAll('.button-gral-stats-visit')
const buttonFinCuarto = document.getElementById('button-fin-cuarto')
const buttonFinPartido = document.getElementById('button-fin-partido')
const pointsLocalHTML = document.getElementById('points-local')
const pointsVisitHTML = document.getElementById('points-visit')
const buttonDeshacer = document.getElementById('deshacer')
const buttonRehacer = document.getElementById('rehacer')
const parrafosStatsLocal = document.querySelectorAll('.p-stats-local')
const parrafosStatsVisit = document.querySelectorAll('.p-stats-visit')
const buttonsCuartos = document.querySelectorAll('.button-cuartos-modal')
const puntosCuartos = document.querySelectorAll('.puntuacion-cuartos')

let cuartoActual = 0
let puntosTotalesStorage = 0

const historialDeshacer = []
const historialRehacer = []

buttonFinPartido.addEventListener('click', async () => {
    if (cuartoActual == 0) {
        const matchId = await createMatch(statsMatch)
        localStorage.setItem('matchId', matchId)
    } 
    guardarObjetoLocal()

    localStorage.removeItem('statsMatch')
    console.log('partido finalizado');
    resetStats(statsMatch)
    pintarPuntosCuartos()
    pintarStatsCuartos()
    pintarStatsGlobal()
    pointsLocalHTML.innerText = statsMatch.local.global.points
    pointsVisitHTML.innerText = statsMatch.visit.global.points
})

function resetStats(obj) {
    for (let key in obj) {
        if (typeof obj[key] === 'number') {
            obj[key] = 0
            
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            resetStats(obj[key])
        }
    }
}

function newPoint(team, cuarto, value) {
    const estadoAnterior = structuredClone(statsMatch)
    historialDeshacer.push(estadoAnterior)
    historialRehacer.length = 0

    statsMatch[team].global.points += value
    statsMatch[team].cuartos[cuarto].points += value
    pintarStatsGlobal()
    pintarPuntosCuartos()

    puntosTotalesStorage += value

    if (puntosTotalesStorage >= 10) {
        localStorage.setItem('statsMatch', JSON.stringify(statsMatch));
        
        puntosTotalesStorage = 0;
        
        console.log('Datos guardados en localStorage');
    }
}

function newStat(team, cuarto, stat) {
    const estadoAnterior = structuredClone(statsMatch)
    historialDeshacer.push(estadoAnterior)
    historialRehacer.length = 0

    statsMatch[team].global[stat]++

    statsMatch[team].cuartos[cuarto][stat]++
    pintarStatsGlobal()
}


function newShoot(team, cuarto, tipe, result) {
    const estadoAnterior = structuredClone(statsMatch)
    historialDeshacer.push(estadoAnterior)
    historialRehacer.length = 0

    statsMatch[team].global.tiros[tipe][result]++
    statsMatch[team].global.tiros[tipe].totales++

    statsMatch[team].cuartos[cuarto].tiros[tipe][result]++
    statsMatch[team].cuartos[cuarto].tiros[tipe].totales++
    pintarStatsGlobal()

}

function newRebote(team, cuarto, tipe) {
    const estadoAnterior = structuredClone(statsMatch)
    historialDeshacer.push(estadoAnterior)
    historialRehacer.length = 0

    statsMatch[team].global.rebotes[tipe]++
    statsMatch[team].global.rebotes.totales++

    statsMatch[team].cuartos[cuarto].rebotes[tipe]++
    statsMatch[team].cuartos[cuarto].rebotes.totales++
    pintarStatsGlobal()
}

function deshacer() {
    let estadoAnterior = historialDeshacer.pop()

    historialRehacer.push(structuredClone(statsMatch))

    Object.assign(statsMatch, structuredClone(estadoAnterior))
    pintarStatsGlobal()
}

function rehacer() {
    let estadoAnterior = structuredClone(statsMatch)
    historialDeshacer.push(estadoAnterior)

    let ultimoEstado = historialRehacer.pop()

    Object.assign(statsMatch, structuredClone(ultimoEstado))
}



buttonsCleanLocal.forEach(button => 
    button.addEventListener('click', ()=> {
        const textButton = button.textContent;
        if (textButton === '3pts') {
            newShoot('local', cuartoActual, 'triples', 'clean')

            newPoint('local', cuartoActual, 3)
            
        } else if (textButton === '2pts') {
            newShoot('local', cuartoActual, 'dobles', 'clean')
            newPoint('local', cuartoActual, 2)
        } else {
            newShoot('local', cuartoActual, 'libres', 'clean')
            newPoint('local', cuartoActual, 1)
        }
        pointsLocalHTML.innerText = statsMatch.local.global.points
        
    })
)

buttonsMissLocal.forEach(button => 
    button.addEventListener('click', ()=> {
        const textButton = button.textContent;
        if (textButton === '3pts') {
            newShoot('local', cuartoActual, 'triples', 'miss')
        } else if (textButton === '2pts') {
            newShoot('local', cuartoActual, 'dobles', 'miss')
        } else {
            newShoot('local', cuartoActual, 'libres', 'miss')
        }
    })
)

buttonsCleanVisit.forEach(button => 
    button.addEventListener('click', ()=> {
        const textButton = button.textContent;
        if (textButton === '3pts') {
            newShoot('visit', cuartoActual, 'triples', 'clean')
            newPoint('visit', cuartoActual, 3)
        } else if (textButton === '2pts') {
            newShoot('visit', cuartoActual, 'dobles', 'clean')
            newPoint('visit', cuartoActual, 2)
        } else {
            newShoot('visit', cuartoActual, 'libres', 'clean')
            newPoint('visit', cuartoActual, 1)
        }
        pointsVisitHTML.innerText = statsMatch.visit.global.points
        
    })
)

buttonsMissVisit.forEach(button => 
    button.addEventListener('click', ()=> {
        const textButton = button.textContent;
        if (textButton === '3pts') {
            newShoot('visit', cuartoActual, 'triples', 'miss')
        } else if (textButton === '2pts') {
            newShoot('visit', cuartoActual, 'dobles', 'miss')
        } else {
            newShoot('visit', cuartoActual, 'libres', 'miss')
        }
    })
)


buttonsGralLocal.forEach(button => 
    button.addEventListener('click', () => {
        const textButton = button.textContent
        if (textButton === 'Reb O') {
            newRebote('local', cuartoActual, 'ofensivos')            
        } else if (textButton === 'Reb D') {
            newRebote('local', cuartoActual, 'defensivos')
        } else if (textButton === 'Per') {
            newStat('local', cuartoActual, 'perdidas')
        } else if (textButton === 'Rec') {
            newStat('local', cuartoActual, 'recuperaciones')
        } else if (textButton === 'Robo') {
            newStat('local', cuartoActual, 'robos')
        } else if (textButton === 'Tapa') {
            newStat('local', cuartoActual, 'tapas')
        }
    })
)

buttonsGralVisit.forEach(button => 
    button.addEventListener('click', () => {
        const textButton = button.textContent
        if (textButton === 'Reb O') {
            newRebote('visit', cuartoActual, 'ofensivos')            
        } else if (textButton === 'Reb D') {
            newRebote('visit', cuartoActual, 'defensivos')
        } else if (textButton === 'Per') {
            newStat('visit', cuartoActual, 'perdidas')
        } else if (textButton === 'Rec') {
            newStat('visit', cuartoActual, 'recuperaciones')
        } else if (textButton === 'Robo') {
            newStat('visit', cuartoActual, 'robos')
        } else if (textButton === 'Tapa') {
            newStat('visit', cuartoActual, 'tapas')
        }
    })
)

buttonFinCuarto.addEventListener('click', () => {
    if (cuartoActual == 3) {
        return
    }
    cuartoActual++
})

buttonDeshacer.addEventListener('click', () => {
    deshacer()
    deshacer()

    pointsLocalHTML.innerText = statsMatch.local.global.points
    pointsVisitHTML.innerText = statsMatch.visit.global.points
})

buttonRehacer.addEventListener('click', () => {
    rehacer()
    rehacer()

    pointsLocalHTML.innerText = statsMatch.local.global.points
    pointsVisitHTML.innerText = statsMatch.visit.global.points
})

function agregarStat(obj, parentKey = '') {
    let result = [];

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const newKey = parentKey ? `${parentKey}.${key}` : key;
            
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                result = result.concat(agregarStat(obj[key], newKey))
            } else if (typeof obj[key] === 'function') {
                const valorCalculado = obj[key]
                result.push([ultimasPalablas(newKey), valorCalculado])
            } else {
                result.push([ultimasPalablas(newKey), obj[key]])
            }
        }
    }
    return result
}

function ultimasPalablas(key) {
    const parts = key.split('.')
    if (parts.length > 1) {
        return `${parts[parts.length - 2]} ${parts[parts.length - 1]}`
    }

    return key
}


const conteinerStats = document.querySelectorAll('.div-stats-team')

function pintarStatsGlobal() {   
    conteinerStats[0].innerHTML = ""
    conteinerStats[1].innerHTML = ""

    const arrayStatsLocal = agregarStat(statsMatch.local.global)
    const arrayStatsVisit = agregarStat(statsMatch.visit.global)

    arrayStatsLocal.forEach(item => {
        const divStats = document.createElement('div')
        divStats.classList.add('div-stat')
        
        conteinerStats[0].appendChild(divStats)
        
        const pStats = document.createElement('p')
        const pPoints = document.createElement('p')        
        
        pStats.textContent = item[0]
        pPoints.textContent = item[1]
        divStats.appendChild(pStats)
        divStats.appendChild(pPoints)

        // item.forEach(element => {
        // })
    })
    
    arrayStatsVisit.forEach(item => {
        const divStats = document.createElement('div')
        divStats.classList.add('div-stat')
        
        conteinerStats[1].appendChild(divStats)
        
        const pStats = document.createElement('p')
        const pPoints = document.createElement('p')        
        
        pStats.textContent = item[0]
        pPoints.textContent = item[1]
        divStats.appendChild(pPoints)
        divStats.appendChild(pStats)
    })
}

pintarStatsGlobal()

function pintarPuntosCuartos() {
    puntosCuartos.forEach((item, index) => {
        if (index == 0) {
            item.innerText = `${statsMatch.local.global.points} / ${statsMatch.visit.global.points}`
        } else {
            item.innerText = `${statsMatch.local.cuartos[index-1].points} / ${statsMatch.visit.cuartos[index-1].points}`
        }
    })
}

pintarPuntosCuartos()

buttonsCuartos.forEach((item, index) => {
    item.addEventListener('click', () => {
        pintarStatsCuartos(index)
    })
})

function pintarStatsCuartos(cuarto) {
    conteinerStats[0].innerHTML = ""
    conteinerStats[1].innerHTML = ""

    if (cuarto == 0) {
        pintarStatsGlobal()
        return
    }
    const arrayStatsLocal = agregarStat(statsMatch.local.cuartos[cuarto-1])
    const arrayStatsVisit = agregarStat(statsMatch.visit.cuartos[cuarto-1])

    arrayStatsLocal.forEach(item => {
        const divStats = document.createElement('div')
        divStats.classList.add('div-stat')
        
        conteinerStats[0].appendChild(divStats)
        
        item.forEach(element => {
            const pStats = document.createElement('p')
            console.log(element);
            
            pStats.textContent = element
            divStats.appendChild(pStats)
        })
    })
    
    arrayStatsVisit.forEach(item => {
        const divStats = document.createElement('div')
        divStats.classList.add('div-stat')
        
        conteinerStats[1].appendChild(divStats)
        
        item.forEach(element => {
            const pStats = document.createElement('p')
            pStats.textContent = element
            divStats.appendChild(pStats)
        })
    })
}



