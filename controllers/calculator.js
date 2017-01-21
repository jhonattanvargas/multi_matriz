'use strict'

//add models require
let addon = require('../build/Release/addon')

//add functions from routes
function serial(req, res){
  var a = req.body.a
  var b = req.body.b
  var n = Number(req.body.n)
  console.log(n)
  let obj = addon.serialProduct(parseArray(a,n),parseArray(b,n))
  if(isNaN(obj.cpus) || isNaN(obj.time)){
    res
      .status(500)
      .send({message:'Error al calcular el producto de matriz'})
  }else{
    res
      .status(200)
      .send({
        "time" : obj.time,
        "cpus" : obj.cpus
      })
  }
}

function parallel(req, res){
  var a = req.body.a
  var b = req.body.b
  var n = Number(req.body.n)
  console.log(n)
  let obj = addon.parallelProduct(parseArray(a,n),parseArray(b,n))
  if(isNaN(obj.cpus) || isNaN(obj.time)){
    res
      .status(500)
      .send({message:'Error al calcular el producto de matriz'})
  }else{
    res
      .status(200)
      .send({
        "time" : obj.time,
        "cpus" : obj.cpus
      })
  }
}

function generate(n){
  let x = new Array(n);
  for (var i = 0; i < x.length; i++) {
    x[i] = new Array(n);
    for (var j = 0; j < x[i].length; j++) {
      x[i][j] = Math.floor((Math.random() * 10));;
    }
  }
  return x;
}

function parseArray(json, n){

  var array = new Array(n);
  for (var i = 0; i < n; i++) {
    array[i] = new Array(n);
  }
  for (var i = 0; i < json.length; i++) {
    array[json[i].i][json[i].j] = json[i].val;
  }
  return array;
}

function test(req, res){
  var a = req.body.a
  var b = req.body.b
  var n = Number(req.body.n)
  console.log(n)
  let obj = addon.serialProduct(parseArray(a,n),parseArray(b,n))
  if(isNaN(obj.cpus) || isNaN(obj.time)){
    res
      .status(500)
      .send({message:'Error al calcular el producto de matriz'})
  }else{
    res
      .status(200)
      .send({
        "time" : obj.time,
        "cpus" : obj.cpus
      })
  }
}

function multi(req, res){
    let x = new Array();
    let testNumber = 10;
    let n = [600,800,1000]
    for (var i = 0; i < n.length; i++) {
        for (var j = 0; j < testNumber; j++) {
          let obj = addon.serialProduct(generate(n[i]),generate(n[i]))
          let aux = new Object();
          aux.time = obj.time
          aux.cpus = obj.cpus
          aux.n = n[i]
          x.push(aux)
          console.log(aux)
        }
    }
    let y = new Array();
    for (let i = 0; i < n.length; i++) {
        for (let j = 0; j < testNumber; j++) {
            let obj = addon.parallelProduct(generate(n[i]),generate(n[i]))
            let aux = new Object();
            aux.time = obj.time
            aux.cpus = obj.cpus
            aux.n = n[i]
            y.push(aux)
            console.log(aux)
        }
    }
    var result = new Object();
    result.medSerial1 = 0;
    result.medSerial2 = 0;
    result.medSerial3 = 0;
    result.medSerial4 = 0;
    result.medParallel1 = 0;
    result.medParallel2 = 0;
    result.medParallel3 = 0;
    result.medParallel4 = 0;
    for (let i = 0; i < x.length; i++) {
        if(x[i].n==600){
            result.medSerial1 += x[i].time / testNumber
        }
        if(x[i].n==800){
            result.medSerial2 += x[i].time / testNumber
        }
        if(x[i].n==1000){
            result.medSerial3 += x[i].time / testNumber
        }
    }

    for (let i = 0; i < y.length; i++) {
        if(y[i].n==600){
            result.medParallel1 += y[i].time / testNumber
        }
        if(y[i].n==800){
            result.medParallel2 += y[i].time / testNumber
        }
        if(y[i].n==1000){
            result.medParallel3 += y[i].time / testNumber
        }
    }

    result.speedUp1 = result.medSerial1 / result.medParallel1
    result.speedUp2 = result.medSerial2 / result.medParallel2
    result.speedUp3 = result.medSerial3 / result.medParallel3
    result.speedUp4 = result.medSerial4 / result.medParallel4

    result.improvement1 = 100*(1 - result.medParallel1 / result.medSerial1)
    result.improvement2 = 100*(1 - result.medParallel2 / result.medSerial2)
    result.improvement3 = 100*(1 - result.medParallel3 / result.medSerial3)
    result.improvement4 = 100*(1 - result.medParallel4 / result.medSerial4)

    console.log(result)

    let arraySend = Array();

    arraySend.push(x)
    arraySend.push(y)
    arraySend.push(result)

    res
    .status(200)
    .send(
        JSON.parse(JSON.stringify(arraySend))
    )
}

module.exports = {
  serial,
  parallel,
  test,
  multi
}
