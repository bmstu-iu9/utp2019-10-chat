﻿# Quick Chat 

## Установка
1. В папке project выполнить:
    ```bash
    npm install
    node reset.js
    ```
2. На ОС Linux необходимо разрешить для nodejs открывать порт с номером 80 следующей командой:
    ```bash
    sudo setcap CAP_NET_BIND_SERVICE=+eip <путь к nodejs>
    ```
    * путь к nodejs можно узнать, выполнив команду
        ```bash
        which node
        ```
    * можно использовать и другие способы разрешить программе открывать порт 80
    * также можно просто запустить сервер на другом порту (как это сделать написано ниже)
 
## Запуск
1. В папке project выполнить:
	```bash
	node run.js
	```
2. Открыть в браузере страницу *http://<имя-хоста>*
	* При запуске сервера на порту 80 (по умолчанию) имя хоста это ip-адрес хоста или его доменное имя
    * Также можно запустить сервер на другом порту командой
	    ```bash
	    node run.js <номер-порта>
	    ```
	* В таком случае необходимо скорректировать URL адрес открываемой страницы в соответствии с указанным портом
	(имя хоста будет выглядеть как *<ip-адрес>:<номер-порта>* или *<доменное-имя>:<номер-порта>*)

## Зависимости
* **nodemailer** — используется для отправки электронного письма на почту пользователя
* **sockets.io** — используется для отправки сообщений в чат и получения их с него

## Разработчики
#### Бригадир
* [Андрей "don-dron" Зворыгин](https://github.com/don-dron)

#### Back-end
* [Владислав "2wendex2" Литовский](https://github.com/2wendex2)
* [Глеб "personalfebus" Завьялов](https://github.com/personalfebus)
* [Парвиз "Aliev2000" Алиев](https://github.com/Aliev2000)

#### Front-end
* [Умар "amaguma" Езиев](https://github.com/amaguma)
* [Андрей "AndVl1" Владиславов](https://github.com/AndVl1)
* [Татьяна "VillKoi" Вольнова](https://github.com/VillKoi)