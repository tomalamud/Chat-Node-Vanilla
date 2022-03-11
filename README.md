# Sockets

Si a través de un socket envío data, esta se envía en forma de buffer de bytes, 
pero si al buffer lo meto en una cadena de texto con ``txt${buffer}txt``,
JS lo codifica automáticamente en formato utf-8.