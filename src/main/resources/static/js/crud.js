console.log("hola desde crud")

document.getElementById("signup_btn").addEventListener("click", async () => {
    console.log("Vamo a hacer signup")
    let name = document.getElementById("s_name").value
    const data = { name : document.getElementById("s_name").value, 
                    email : document.getElementById("s_email").value,
                    username : document.getElementById("s_username").value,
                    pswd : document.getElementById("s_pswd").value
    }
    console.log(data)
    let promesa = await fetch("/users/signup",{ method : "POST" , headers : { "Content-Type" : "application/json"} , body : JSON.stringify(data)} )
    let respuesta = await promesa.json()
    console.log(respuesta)

} )


document.getElementById("login_btn").addEventListener("click", async () => {
    const data = {email : document.getElementById("l_email").value , pswd : document.getElementById("l_pswd").value }
    console.log(data) 
    let promesa = await fetch("/users/login",{method : "POST" , headers : { "Content-Type" : "application/json"}, body : JSON.stringify(data)} )
    let respuesta = await promesa.json() 
    console.log(respuesta)
})