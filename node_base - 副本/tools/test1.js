function getArrayItems(arr, num) {
    var temp_array = new Array();
    for (var index in arr) {
        temp_array.push(arr[index]);
    }
    var return_array = new Array();
    for (var i = 0; i<num; i++) {
        if (temp_array.length>0) {
            var arrIndex = Math.floor(Math.random()*temp_array.length);
            return_array[i] = temp_array[arrIndex];
            temp_array.splice(arrIndex, 1);
        } else {
            break;
        }
    }
    return return_array;
}

//测试
var ArrList=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33];
function test(key){
    let cont=0;
    for(let i=0;i<10000;i++){
        let res = getArrayItems(ArrList,6);
        for(let y in res){
          if(res[y]==key){
             cont++;
          }
        }
    }
    console.log(cont)
}

alert(getArrayItems(ArrList,6));