var button = document.querySelector(".button");
var text = document.querySelector(".text");
var p = document.querySelector("p");
var api = "37724d0b78524ffa8fe34534252606";

button.addEventListener("click", () => {
    console.log(text.value)
})


button.addEventListener("click", async () => {
    const city = text.value;
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${api}&q=${city}&aqi=yes`);
    const data = await response.json();
    if(!data){
        console.log("failed to fetch data")
        p.innerHTML = 'Input is Invalid'
    }

    console.log(data)
    p.innerHTML = `The Weather in ${city} is ${data.current.temp_c} &degC and condition is ${data.current.condition.text}`
})