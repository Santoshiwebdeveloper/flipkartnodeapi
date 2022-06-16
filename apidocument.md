//page1
>list of products based on product name
>>(Get)  http://localhost:9100/products?categoryname=Mobiles

>list of menu items
>>(Get) http://localhost:9100/categories

>list of best selling products
>>(Get) http://localhost:9100/bestsellingproducts


//page2
>filter products based on brand (Get)
>>http://localhost:9100/filter/3?brandid=1

>filter products based on price (Get)
>>http://localhost:9100/filter/1?lcost=700&hcost=1200

>sort products based on price (Get)
>>http://localhost:9100/filter/1?lcost=500&hcost=1200&sort=-1


//page3
>details of the product based on id (Get)
>>http://localhost:9100/details/1

>based on selected product display remaining products related to selected product brand name (Get)
>>http://localhost:9100/relatedproductdetails/Oppoo

//page4
> products details (selected items)
>>(Post) localhost:9100/menuItem
[1,4,6]

>place order
> Place order
>>(Post) localhost:9100/placeOrder
(
    {
        "name":"Nikita",
        "email":"nikita@gmail.com",
        "address":"Hom 39",
        "phone":934645457,
        "cost":845,
        "menuItem":[10,13,17]
    }
)

//page5
>list of order placed
>>(Get) http://localhost:9100/orders
>list of order placed of particular user
>>(Get) http://localhost:9100/orders?email=amit@gmail.com
>update order status
>>(Put) http://localhost:9100/updateOrder/2
(
    {
        "status":"TAX_FAIL",
        "bank_name":"AXIS",
        "date":"29/05/2023"
    }   
)

//////////
>delete orders
>>(Delete) localhost:9100/deleteOrder/628c485d93399d546c136d84