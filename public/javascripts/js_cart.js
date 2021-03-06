jQuery(document).ready(function($) {
  var cartWrapper = $('.cd-cart-container');
  //product id - you don't need a counter in your real project but you can use your real product id
  var productId = 0;

  var counton = $('.checkout');

  if (cartWrapper.length > 0) {
    //store jQuery objects
    var cartBody = cartWrapper.find('.body')
    var cartList = cartBody.find('ul').eq(0);
    var cartTotal = cartWrapper.find('.checkout').find('span');
    var cartTrigger = cartWrapper.children('.cd-cart-trigger');
    var cartCount = cartTrigger.children('.count')
        //var addToCartBtn = $('.cd-add-to-cart');
    var addToCartBtn = $('.add-button');
    var undo = cartWrapper.find('.undo');
    var undoTimeoutId;

    //购物车删除菜品后同时清空页面内的相应的菜品的数量
    function cleanNum(itemName) {
      $(".menu-item .tit").each(function () {
        if ($(this).text() == itemName) {
          $(this).siblings(".count").find(".label-num").text(0);
          return;
        }
      });
    }

    //add product to cart
    $('body').on('click', '.add-button', function(event) {
        event.preventDefault();
        addToCart($(this));
    });

    $('body').on('click', '.dec-button', function(event) {
        event.preventDefault();
      if (Number($("#cd-product-" + $(this).data('proid')).text()) > 0) {
        decreaseToCart($(this));
      }           
    });

    function decreaseToCart(trigger) {
      var cartIsEmpty = cartWrapper.hasClass('empty');
      var price = trigger.data('price'),
          proname = trigger.data('proname'),
          proid = trigger.data('proid'),
          proimg = trigger.data('proimg');
      decreaseProduct(proname,proid,price,proimg);
      //update number of items 
      decreaseCartCount(cartIsEmpty);
      //update total price
      updateCartTotal(trigger.data('price'), false);
    }


    function decreaseProduct(proname,proid,price,proimg) {
      productId = productId + 1;     
      var quantity = $("#cd-product-"+proid).text();
      var select='',productAdded='';
      quantity = parseInt(quantity);
      //var select = '<span class="select">x<i id="cd-product-'+proid+'">'+quantity+'</i></span>';
      $("#cd-product-"+proid).html(quantity-1);
      //alert(quantity-1);

      if((quantity-1) ==  0) {
          $(".product-"+proid).remove();
      }
    }

    function decreaseCartCount(emptyCart, quantity) {
      if( typeof quantity === 'undefined' ) {
        var actual = Number(cartCount.find('li').eq(0).text()) - 1;
        var next = actual - 1;
              
        if( emptyCart ) {
          cartCount.find('li').eq(0).text(actual);
          cartCount.find('li').eq(1).text(next);
        }
        else {
          cartCount.addClass('update-count');

          setTimeout(function() {
              cartCount.find('li').eq(0).text(actual);
          }, 150);

          setTimeout(function() {
              cartCount.removeClass('update-count');
          }, 200);

          setTimeout(function() {
              cartCount.find('li').eq(1).text(next);
          }, 230);
        }
      }
      else {
        var actual = Number(cartCount.find('li').eq(0).text()) + quantity;
        var next = actual - 1;
        
        cartCount.find('li').eq(0).text(actual);
        cartCount.find('li').eq(1).text(next);
      }
    }
    //open/close cart
    cartTrigger.on('click', function(event) {
      event.preventDefault();
      toggleCart();
    });

    //close cart when clicking on the .cd-cart-container::before (bg layer)
    cartWrapper.on('click', function(event) {
      if ($(event.target).is($(this)))
        toggleCart(true);
    });

    //delete an item from the cart
    cartList.on('click', '.delete-item', function(event) {
      event.preventDefault();
      //if (Number($("#cd-product-" + $(this).data('proid')).text()) > 0) {
      cleanNum($(this).parent().siblings("h3").children("a").text());
        removeProduct($(event.target).parents('.product'));
     // }
    });

    //update item quantity
    cartList.on('change', 'select', function(event) {
      quickUpdateCart();
    });

    //reinsert item deleted from the cart
    undo.on('click', 'a', function(event) {
      clearInterval(undoTimeoutId);
      event.preventDefault();
      cartList.find('.deleted').addClass('undo-deleted').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function() {
        $(this).off('webkitAnimationEnd oanimationend msAnimationEnd animationend').removeClass('deleted undo-deleted').removeAttr('style');
        quickUpdateCart();
      });
      undo.removeClass('visible');
    });
  }

  function toggleCart(bool) {
    var cartIsOpen = (typeof bool === 'undefined') ? cartWrapper.hasClass('cart-open') : bool;

    if (cartIsOpen) {
      cartWrapper.removeClass('cart-open');
      //reset undo
      clearInterval(undoTimeoutId);
      undo.removeClass('visible');
      cartList.find('.deleted').remove();

      setTimeout(function() {
        cartBody.scrollTop(0);
        //check if cart empty to hide it
        if (Number(cartCount.find('li').eq(0).text()) == 0)
          cartWrapper.addClass('empty');
      }, 500);
    } else {
      cartWrapper.addClass('cart-open');
    }
  }

  function addToCart(trigger) {
    var cartIsEmpty = cartWrapper.hasClass('empty');
    //update cart product list
    var price = trigger.data('price'),
        proname = trigger.data('proname'),
        proid = trigger.data('proid'),
        proimg = trigger.data('proimg');
    addProduct(proname, proid, price, proimg);
    //update number of items 
    updateCartCount(cartIsEmpty);
    //update total price
    updateCartTotal(trigger.data('price'), true);
    //show cart
    cartWrapper.removeClass('empty');
  }

  function addProduct(proname, proid, price, proimg) {
    //this is just a product placeholder
    //you should insert an item with the selected product info
    //replace productId, productName, price and url with your real product info
    productId = productId + 1;

    var quantity = $("#cd-product-" + proid).text();
    var select = '',
        productAdded = '';

    if (quantity == '') {
      var select = '<span class="select">x<i id="cd-product-' + proid + '">1</i></span>';
      var productAdded = $('<li class="product product-' + proid + ' "><div class="product-details"><h3><a href="#0">' + proname + '</a></h3><span class="price">￥' + price + '</span><div class="actions"><a href="#0" class="delete-item">删除</a><div class="quantity"><label for="cd-product-' + proid + '">件数</label>' + select + '</div></div></div></li>');
      cartList.prepend(productAdded);
    }
    else {
      quantity = parseInt(quantity);
      //var select = '<span class="select">x<i id="cd-product-'+proid+'">'+quantity+'</i></span>';
      $("#cd-product-" + proid).html(quantity + 1);
    }
  }

  function removeProduct(product) {
    clearInterval(undoTimeoutId);
    cartList.find('.deleted').remove();

    var topPosition = product.offset().top - cartBody.children('ul').offset().top,
        productQuantity = Number(product.find('.quantity').find('.select').find('i').text()),
        productTotPrice = Number(product.find('.price').text().replace('￥', '')) * productQuantity;

    product.css('top', topPosition + 'px').addClass('deleted');

    //update items count + total price
    updateCartTotal(productTotPrice, false);
    updateCartCount(true, -productQuantity);
    undo.addClass('visible');

    //wait 8sec before completely remove the item
    undoTimeoutId = setTimeout(function() {
      undo.removeClass('visible');
      cartList.find('.deleted').remove();
    }, 8000);
  }

  function quickUpdateCart() {
    var quantity = 0;
    var price = 0;

    cartList.children('li:not(.deleted)').each(function() {
      var singleQuantity = Number($(this).find('.select').find('i').text());
      quantity = quantity + singleQuantity;
      price = price + singleQuantity * Number($(this).find('.price').text().replace('￥', ''));
    });

    cartTotal.text(price.toFixed(2));
    cartCount.find('li').eq(0).text(quantity);
    cartCount.find('li').eq(1).text(quantity + 1);
  }

  function updateCartCount(emptyCart, quantity) {
    if (typeof quantity === 'undefined') {
      var actual = Number(cartCount.find('li').eq(0).text()) + 1;
      var next = actual + 1;

      if (emptyCart) {
        cartCount.find('li').eq(0).text(actual);
        cartCount.find('li').eq(1).text(next);
      }
      else {
        cartCount.addClass('update-count');

        setTimeout(function() {
          cartCount.find('li').eq(0).text(actual);
        }, 150);

        setTimeout(function() {
          cartCount.removeClass('update-count');
        }, 200);

        setTimeout(function() {
          cartCount.find('li').eq(1).text(next);
        }, 230);
      }
    }
    else {
      var actual = Number(cartCount.find('li').eq(0).text()) + quantity;
      var next = actual + 1;

      cartCount.find('li').eq(0).text(actual);
      cartCount.find('li').eq(1).text(next);
    }
  }

  function updateCartTotal(price, bool) {
    bool ? cartTotal.text((Number(cartTotal.text()) + Number(price)).toFixed(2)) : cartTotal.text((Number(cartTotal.text()) - Number(price)).toFixed(2));
  }

  counton.on('click', function(event) {
    var data = new Array();
    $(".product-details").each(function() {
      var itemJSON = "{";
      itemJSON += "\"name\":\"" + $(this).find("h3 a").text() + "\",";
      itemJSON += "\"price\":" + $(this).find(".price").text().slice(1) + ",";
      itemJSON += "\"num\":" + $(this).find(".select i").text() + ",";
      data.push(itemJSON);
    });


    for(var i = 0; i < data.length; i++) {
      var index_end = data[i].indexOf(",");
      var name = data[i].slice(8, index_end);
      var index=0;
      $("#code-data .tit").each(function() {
        console.log(index++);
        if("\"" + $(this).text() + "\"" == name) {
          data[i] += "\"cost\":" + $(this).parents(".row").find(".code-cost").text() + "}";
          return;
        }
      });
    }

    data = "{\"data\":[" + data + "]}";
    //转换成JS对象
    data = eval("(" + data + ")");

    jQuery.ajax({
      type: "POST",
      timeout: 80000,
      url: "",
      dataType: 'json',
      data: data,
      success: function(data, textStatus) {
        window.location.href = "http://" + window.location.host + "/" + $("#code-username").text() + "/handin/?id=" + data[0] + "&order=detail&tableID=" + data[1];
      },
      error: function(xhr, status, errMsg) {
        alert("操作失败!");
      }
    });
  });
});
