[![Stories in Progress](https://badge.waffle.io/APE-EDX/APE.svg?label=In%20Progress&title=In%20Progress)](http://waffle.io/APE-EDX/APE)

This is the main APE project, it can be used to build and run APE (development version).

See \<link-here-when-available> here for a ready-to-used compiled version.

Instructions are quite simple:

1. Clone this project by issuing:
    ```
    git clone --recursive https://github.com/APE-EDX/APE
    ```
    Please note the recursive option, as to obtain all submodules too

2. Compile all dependencies so that they are up to date (from within the cloned repository):
    ```
    mkdir build
    cd build
    cmake ..
    cmake --build .
    ```
    Or using the GUI based CMake and then building the generated solution

3. Update APE UI by:
    ```
    npm run build
    ```

4. Run APE with:
    ```
    npm start
    ```
    Optionally use devtools with:
    ```
    npm start -- -d
    ```

------------------------

NO WARRANTIES: All of the information, code and programs provided on this repository are provided "AS-IS" and with NO WARRANTIES. No express or implied warranties of any type, including for example implied warranties of merchantability or fitness for a particular purpose, are made with respect to the information, or any use of the information, on this site. PushEdx, Push-EDX and APE members make no representations and extends no warranties of any type as to the accuracy or completeness of any information or content on this repository.

DISCLAIMER OF LIABILITY: PushEdx, Push-EDX and APE members specifically DISCLAIMS LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES and assume no responsibility or liability for any loss or damage suffered by any person as a result of the use or misuse of any of the information or content on this website. PushEdx, Push-EDX and APE members assume or undertake NO LIABILITY for any loss or damage suffered as a result of the use, misuse or reliance on the information and content on this website.

USE AT YOUR OWN RISK: Content is for educational purposes only. Consult the target process/program/anything's TOS before using it. It is your responsibility to evaluate them. Any misuse or infringing the TOS/EULAs may result in denial of services to the target. By voluntarily using the provided code and programs, you assume the risk of any resulting consequence.
