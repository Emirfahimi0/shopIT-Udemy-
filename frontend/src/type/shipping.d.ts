

declare interface IShippingInfo {
    address: string;
    city: string;
    postalCode:string;
    phoneNum:string;
    country: string;
}

interface CartItem {
    product: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
  }