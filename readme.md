[![Stories in Progress](https://badge.waffle.io/APE-EDX/APE.svg?label=ready&title=In+Proress)](http://waffle.io/APE-EDX/APE)

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
