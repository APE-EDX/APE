#pragma once

#include <iostream>
#include <string>
#ifdef _WIN32
    #include <Winsock2.h>
    #include <Windows.h>
#else
    #include <unistd.h>
    #include <stdio.h>
    #include <sys/types.h>
    #include <sys/socket.h>
    #include <netinet/in.h>
    #include <arpa/inet.h>
    #include <netinet/tcp.h>
    #include <netdb.h>
    #include <poll.h>
#endif

#ifdef ERROR
    #undef ERROR
#endif

#ifndef _WIN32
    #define closesocket ::close
    #define SOCKADDR struct sockaddr
#endif

#ifndef SOCKET_ERROR
    #define SOCKET_ERROR -1
#endif


enum class SocketStatus
{
    DISCONNECTED,
    CONNECTED,
    SERVING,
    CLOSING,
    CLOSED,
    ERROR
};

enum class SocketError
{
    NONE,
    INITIALIZATION_ERROR,
    INSTANTIATION_ERROR,
    CONNECT_ERROR,
    BIND_ERROR,
    LISTEN_ERROR,
    SEND_ERROR,
    RECV_ERROR,
    BROKEN_PIPE
};

class Socket
{
public:
    virtual ~Socket();

    bool setOption(int level, int option, const char* value, int valueLength);

    inline int sock() { return _socket; }
    inline SocketStatus status() { return _status; }
    inline SocketError error() { return _error; }

    virtual int send(const char* buffer, int len);
    std::string recv();
    virtual void close();

    inline SocketError lastError() { return _error; }

protected:
    Socket();
    Socket(int family, int type, int protocol);
    void setError(SocketError error);

protected:
    static int _initialized;
    int _socket;
    int _family;
    int _type;
    int _protocol;
    char* _buf;
    SocketStatus _status;
    SocketError _error;
};

class ClientSocket : public Socket
{
public:
    ClientSocket(int family, int type, int protocol);
    bool connect(std::string ip, int16_t port);
};
