/**
 * CSC 337
 * Ellie Martin
 */

function login(){
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    let url = 'http://146.190.160.62/login/'+username+'/'+password;

    if (username != '' && password != ''){
        fetch(url)
            .then((response) => {
                return response.text();
            })
            .then((res) => {
                console.log(res);
                if (res == 'FAILED'){
                    console.log('Invalid Login');
                    document.getElementById('failedRes').innerText = 'Cannot login with that info.'
                }
                else {
                    document.getElementById('failedRes').innerText = ''
                    window.location.href = 'http://146.190.160.62/home.html';
                    console.log(res);
                }
                console.log("USER: "+user);
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

function createAccount(){
    var username = document.getElementById('newUser').value;
    var password = document.getElementById('newPass').value;

    if (username != '' && password != ''){
        let url = 'http://146.190.160.62/add/user';
        let postStr = 'username='+username+'&password='+password;

        var httpRequest = new XMLHttpRequest();
        if (!httpRequest) {
            return false;
        }

        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    console.log(httpRequest.responseText);
                } else { 
                    return false; 
                }
            }
        }

        httpRequest.open('POST', url);
        httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        httpRequest.send(postStr);
    }
}

function addItemRedirect(){
    let url = 'http://146.190.160.62/post';

    fetch(url)
        .then((response) => {
            return response.url;
        })
        .then((res) => {
            console.log(res);
            window.location.href = res;
        })
        .catch((err) => {
            console.log(err);
        });
}

/**
 * This function takes the input from the texboxes in the addItem div, and 
 * builds the post parameters string fron the inputs and send a post request
 * to the server to add the item to the database and add the item id to the 
 * user's listings array.
 */
function addItem(){
    var title = document.getElementById('title').value;
    var desc = document.getElementById('desc').value;
    var img = document.getElementById('img').value;
    var price = document.getElementById('price').value;
    var stat = document.getElementById('stat').value;
    var user = document.cookie.split('%22').at(3);

    console.log(title+" "+desc+" "+img+" "+price+" "+stat+" "+user);
    if (user != ''){
        let url = 'http://146.190.160.62/add/item/'+user;
        let postStr = 'title='+title+'&desc='+desc+'&img='+img+'&price='+price+'&stat='+stat;

        var httpRequest = new XMLHttpRequest();
        if (!httpRequest) {
            return false;
        }

        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    console.log(httpRequest.responseText);
                } else { 
                    return false; 
                }
            }
        }

        httpRequest.open('POST', url);
        httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        httpRequest.send(postStr);
    }
}

function getListings(){
    var user = document.cookie.split('%22').at(3);
    let url = 'http://146.190.160.62/get/listings/'+user;

    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((res) => {
            let str = JSON.stringify(res);
            let listings = JSON.parse(str);
            displayListings(listings);
        })
        .catch((err) => {
            console.log(err);
        });
}

function getPurchases(){
    var user = document.cookie.login.username;
    let url = 'http://146.190.160.62/get/purchases/'+user;
    
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((res) => {
            let str = JSON.stringify(res);
            let listings = JSON.parse(str);
            displayListings(listings);
        })
        .catch((err) => {
            console.log(err);
        });
}

function searchListings(){
    var key = document.getElementById('search').value;
    let url = 'http://146.190.160.62/search/items/'+key;
    
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((res) => {
            let str = JSON.stringify(res);
            let listings = JSON.parse(str);
            displayListings(listings);
        })
        .catch((err) => {
            console.log(err);
        });
}

function displayListings(listings){
    document.getElementById('leftSide').innerHTML = '';
    let i = 0;
    while (i < listings.length){
        var title = listings[i].title;
        var img = listings[i].image;
        var desc = listings[i].description;
        var price = listings[i].price;
        var stat = listings[i].stat;
        addListing(title, img, desc, price, stat);
        i++;
    }
}

function addListing(title, img, desc, price, stat){
    var section = document.createElement('div');
    section.className = 'listings';

    var p_title = document.createElement('p');
    var p_img = document.createElement('p');
    var p_desc = document.createElement('p');
    var p_price = document.createElement('p');
    var p_stat = document.createElement('p');

    var text_title = document.createTextNode(title);
    var text_img = document.createTextNode(img);
    var text_desc = document.createTextNode(desc);
    var text_price = document.createTextNode(price);

    p_title.appendChild(text_title);
    p_img.appendChild(text_img);
    p_desc.appendChild(text_desc);
    p_price.appendChild(text_price);

    if (stat == 'SOLD'){
        var text_stat = document.createTextNode(stat);
        p_stat.appendChild(text_stat);
    } else {
        var sale_button = document.createElement('input');
        sale_button.type = "button";
        sale_button.name = 'purchase';
        sale_button.value = "Buy Now!";
        sale_button.onclick = function() {
            var d = desc;
            var user = document.cookie.split('%22').at(3);
            let url = "http://146.190.160.62/add/purchase/"+user+"/"+d;

            fetch(url)
                .then((response) => {
                    return response.text();
                })
                .then((res) => {
                    alert(res);
                })
                .catch((err) => {
                    console.log(err);
                });
            //add to purchase list
        }

        p_stat.appendChild(sale_button);
    }

    section.appendChild(p_title);
    section.appendChild(p_img);
    section.appendChild(p_desc);
    section.appendChild(p_price);
    section.appendChild(p_stat);

    var side = document.getElementById('leftSide');
    side.appendChild(section);
}