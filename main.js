var product = []; // json 데이터를 임시적으로 담아놓는 변수 
var dragProduct; // 드래그한 상품의 HTML을 담아놓는 변수
var dragProductId; // 드래그를 시작한 상품 div의 아이디 값
var isEixst = false; // 장바구니 div에 '여기로 드래그'라는 텍스트를 조절하기 위한 flag
var isEixstProduct = [0, 0, 0, 0]; // 장바구니에 담은 각각의 상품 수를 담아놓는 변수

// PART: Ajax
$.get('json/store.json').done(function(data){

    product = data.products
    
    for(i = 0; i<data.products.length; i++){
        createProduct(data.products[i].id, data.products[i].photo, data.products[i].title, data.products[i].brand, data.products[i].price);
    }
    
}).fail(function(){
	alert('데이터 통신에 실패했습니다.')
})

// PART: 검색창 관련
$('#search').keyup(function(){
    
    for(i = 0; i < product.length; i++) {  
        if (product[i].title.includes($('#search').val()) || product[i].brand.includes($('#search').val())){    
            $('.products-Container').html('');
            createProduct(product[i].id, product[i].photo, product[i].title, product[i].brand, product[i].price);
            break
        }     
    }

    // 검색창이 공백이면 다시 원래대로 
    if ($('#search').val() == '') {
       resetProduct();
    }

})

// PART: 상품 페이지에서 드래그 시작 감지하는 부분
$('.products-Container').on('dragstart', function(e){
    
    dragProductId = e.target.id
    
    dragProduct = `<div class="cart-Container" draggable = "true">
    <img src=${Array.from(e.target.childNodes)[1].currentSrc} alt="" style="width: 200px;" draggable = "false" >
    <div class="title"><b>${Array.from(e.target.childNodes)[3].innerText}</b></div>
    <div class="brand">${Array.from(e.target.childNodes)[5].innerText}</div>
    <div class="price">${Array.from(e.target.childNodes)[7].innerText}</div>
    <div class="count">수량: ${isEixstProduct[dragProductId]}</div>
    </div>`
    
})

// drop을 쓰기 위해서는 dragover가 있어야해서 작성
$('.drag-Area').on('dragover', function(e){
    e.preventDefault();
    
})

// PART: 장바구니에 드래그한 상품을 놓으면 감지하는 부분
$('.drag-Area').on('drop', function(e){
    
    if (!isEixst) { // 여기로 드래그 텍스트를 없애는 파트
        $('.drag-Area').html('');
        isEixst = true;
    }

    // 드래그한 상품이 이미 존재하는 경우
    if (isEixstProduct[dragProductId] > 0) {
        isEixstProduct[dragProductId] += 1;
        // 해당 부분의 수량을 증가시킨다.
        regenerateCart()
    } else { // 드래그한 상품이 존재하지 않는 경우
        isEixstProduct[dragProductId] += 1;
        createCart(product[dragProductId].photo, product[dragProductId].title, product[dragProductId].brand, product[dragProductId].price, isEixstProduct[dragProductId])
    }

    $('.buyArea').css('display', 'block');
    $('.totalPrice').text('총 가격: '+ calTotalPrice() + '원');
    
})

// PART: 이벤트 버블링을 활용해서 담기 버튼을 클릭을 감지하는 부분
$('.products-Container').click(function(e){

    if (!isEixst) {
        $('.drag-Area').html('');
        isEixst = true;
    }

    for(i = 0; i < product.length; i++) {
        if (e.target == document.getElementsByClassName('buy')[i]) {
            if (isEixstProduct[i] > 0) {
                isEixstProduct[i] += 1;
                regenerateCart()
            } else {
                isEixstProduct[i] += 1;
                createCart(product[i].photo, product[i].title, product[i].brand, product[i].price, isEixstProduct[i])
            }
            console.log(isEixstProduct);   
        }
    }
    $('.buyArea').css('display', 'block');
    $('.totalPrice').text('총 가격: '+ calTotalPrice() + '원');
})

$('.totalBuy').click(function(){
    $('.black-bg').addClass('show-modal');
})

$('#close').click(function(){
    $('.black-bg').removeClass('show-modal');
})





function createProduct(id, photo, title, brand, price) {
    var htmlCode = `<div id="${id}"class="product-Container" draggable = "true">
    <img src=img/${photo} alt="" style="width: 200px;" draggable = "false">
    <div class="title"><b>${title}</b></div>
    <div class="brand">${brand}</div>
    <div class="price">가격: ${price}</div>
    <button class="buy">담기</button>
    </div>`
    $('.products-Container').append(htmlCode);
}

function createCart(photo, title, brand, price, count) {
    var htmlCode = `<div class="cart-Container" draggable = "true">
    <img src=img/${photo} alt="" style="width: 200px;" draggable = "false" >
    <div class="title"><b>${title}</b></div>
    <div class="brand">${brand}</div>
    <div class="price">가격: ${price}</div>
    <div class="count">수량: ${count}</div>
    </div>`
    $('.drag-Area').append(htmlCode);
}

function resetProduct() {
    $('.products-Container').html('');
        for(j = 0; j < product.length; j++) {
            createProduct(product[j].id, product[j].photo, product[j].title, product[j].brand, product[j].price);
        }
}

function regenerateCart() {
    $('.drag-Area').html('');
        for(j = 0; j < product.length; j++) {
            if (isEixstProduct[j] > 0){
                createCart(product[j].photo, product[j].title, product[j].brand, product[j].price, isEixstProduct[j]);
            }
            
        }
}

// PART: 총 가격을 계산하는 함수
function calTotalPrice(){
    var totalResult = 0;
    isEixstProduct.forEach(function(a, i){
        totalResult += a*(i+1)*10000
        console.log(isEixstProduct);
        
        console.log(a*i*10000);
        
    })
    return totalResult
}
