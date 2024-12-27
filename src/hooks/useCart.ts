import { useState, useEffect, useMemo } from "react";
import { db } from "../data/data";

export const useCart = () => {
  const initialCart = () => {
    // funcion que nos permite recuperar los datos almacenados y cargarlos al state
    const localStorageCart = localStorage.getItem(`cart`); // recupera los datos almacenados
    return localStorageCart ? JSON.parse(localStorageCart) : []; // si existe los convierte a un arreglo de nuevo, sino, arreglo vacio
  };

  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);
  const MAX_ITEMS = 5;
  const MIN_ITEMS = 1;

  //Como el useState es Asincrono, se ejecutava primero la funcion antes de que el state se actualizara, para evitar eso
  // usamos el useEfect, que se va a ejecutar cuando el state(cart) cambie. Osea, lo espera hasta que este completo.
  useEffect(() => {
    localStorage.setItem(`cart`, JSON.stringify(cart)); // ver mas abajo los comentarios de como implementarlo.
  }, [cart]);

  // Funtion para agregar productos al carrito
  function addToCart(item) {
    const itemExists = cart.findIndex((guitar) => guitar.id === item.id);

    // si devuelve -1 significa que el carrito esta vacio y agrega el producto
    if (itemExists < 0) {
      item.quantity = 1; // nuevo atributo que se le agrega el obj item
      setCart([...cart, item]); // se le agrega el articulo al carrito manteniendo los datos anteriores
      console.log("se agrego");
      // si ya existe, solo le suma 1 a la cantidad del producto
    } else {
      const updateCart = [...cart];
      if (cart[itemExists].quantity >= MAX_ITEMS) return; // para evitar que se agregen mas cantidades desde la pantalla principal
      updateCart[itemExists].quantity++;
      setCart(updateCart);
      console.log("Ya existe...");
    }
  }

  // Funcion para eliminar productos del carrito
  function removeFromCart(id) {
    setCart((prevCar) => prevCar.filter((guitar) => guitar.id !== id));
  }

  // Funtion para Incrementar las cantidades del carrito
  function increaseQuantity(id) {
    const updateCart = cart.map((item) => {
      if (item.id == id && item.quantity < MAX_ITEMS) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      } // se tienen que devolver completos los items que no se modificaron
      return item;
    });
    setCart(updateCart); // se actializa con las nuevas cantidades
  }
  // Funtion para Decrementar las cantidades del carrito
  function decreaseQuantity(id) {
    const updateCart = cart.map((item) => {
      if (item.id == id && item.quantity > MIN_ITEMS) {
        // limita que continue decrementando
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      } // se tienen que devolver completos los items que no se modificaron
      return item;
    });
    setCart(updateCart); // se actializa con las nuevas cantidades
  }

  // Funtion para vaciar el carrito de compras
  function cleanCart() {
    setCart([]);
  }

  const isEmpty = useMemo(() => cart.length === 0, [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.quantity * item.price, 0),
    [cart]
  );

  // Almacenamiento en Local Storege
  //function saveLocalStorage() {
  // solo almana String, por eso se convierte con JSON.stringify
  // 1° parametro el nombre de como se va a guardar, 2° es lo que se va a guardar
  //localStorage.setItem(`cart`, JSON.stringify(cart));
  //}

  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    cleanCart,
    isEmpty,
    cartTotal,
  };
};
