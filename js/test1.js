var friends = {}
   friends.bill = {
        name:"bill",
        firstName:"Bill",
        lastName:"a",
        number:"1",
        address:['usa','newyork'],
    };
     friends.steve = {
        name:"steve",
        firstName:"Steve",
        lastName:"b",
        number:"2",
        address:['usa','newyork'],
    };
// var list = function(friends){
//     var a = friends.length;
//     for(var name in friends){
//     console.log(name);
//     };
// }
var search = function(name){    
   for(var bill in friends){
     if(friends[bill].firstName === name){
         console.log(friends[bill]);
         return friends[bill];
         }
       }
};