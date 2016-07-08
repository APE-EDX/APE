#include "socket.hpp"
#include <cassert>


int Socket::_initialized = 0;

Socket::Socket():
	_socket(SOCKET_ERROR),
	_status(SocketStatus::DISCONNECTED),
	_error(SocketError::NONE)
{
	_buf = new char[8192];
}

Socket::Socket(int family, int type, int protocol) :
	_socket(SOCKET_ERROR),
	_family(family),
	_type(type),
	_protocol(protocol),
	_status(SocketStatus::DISCONNECTED),
	_error(SocketError::NONE)
{
	if (_initialized == 0)
	{
		++_initialized;

#ifdef _WIN32
		WSADATA wsaData;
		int iResult = WSAStartup(MAKEWORD(2, 2), &wsaData);
		if (iResult != NO_ERROR) {
			setError(SocketError::INITIALIZATION_ERROR);
		}
#endif
	}

	if (_error == SocketError::NONE)
	{
		_socket = socket(family, type, protocol);

		if (_socket == SOCKET_ERROR)
		{
			setError(SocketError::INSTANTIATION_ERROR);
		}
		else
		{
			_buf = new char[8192];
		}
	}
}

Socket::~Socket()
{
	close();

	delete[] _buf;

	--_initialized;
	if (_initialized == 0)
	{
#ifdef _WIN32
		WSACleanup();
#endif
	}
}

bool Socket::setOption(int level, int option, const char* value, int valueLength)
{
	//assert(_status == SocketStatus::DISCONNECTED);

	int result = setsockopt(_socket, level, option, value, valueLength);
	return result != SOCKET_ERROR;
}

std::string Socket::recv()
{
	assert(_status == SocketStatus::CONNECTED);

	memset(_buf, 0, 8192);
	int result = ::recv(_socket, _buf, 8192, 0);

	if (result == 0)
	{
		setError(SocketError::RECV_ERROR);
	}
	else if (result == -1)
	{
		setError(SocketError::BROKEN_PIPE);
	}

	if (result > 0)
	{
		return std::string(_buf, result);
	}
	else
	{
		return NULL;
	}
}

void Socket::setError(SocketError error)
{
	_status = SocketStatus::ERROR;
	if (_socket != SOCKET_ERROR)
	{
		closesocket(_socket);
	}
}

void Socket::close()
{
	if (_status == SocketStatus::CONNECTED || _status == SocketStatus::CLOSING)
	{
		closesocket(_socket);
		_status = SocketStatus::CLOSED;
	}
}

int Socket::send(const char* buffer, int len)
{
	assert(_status == SocketStatus::CONNECTED || _status == SocketStatus::CLOSING);

	int result = ::send(_socket, buffer, len, 0);

	if (result != len)
	{
		setError(SocketError::SEND_ERROR);
	}
	else if (result == -1)
	{
		setError(SocketError::BROKEN_PIPE);
	}

	return result;
}

ClientSocket::ClientSocket(int family, int type, int protocol) :
	Socket(family, type, protocol)
{}

bool ClientSocket::connect(std::string ip, int16_t port)
{
	assert(_status == SocketStatus::DISCONNECTED);

	sockaddr_in clientService;
	clientService.sin_family = AF_INET;
	clientService.sin_addr.s_addr = inet_addr(ip.c_str());
	clientService.sin_port = htons(port);

	int result = ::connect(_socket, (SOCKADDR*)&clientService, sizeof(clientService));
	if (result == SOCKET_ERROR)
	{
		setError(SocketError::CONNECT_ERROR);
		return false;
	}

	_status = SocketStatus::CONNECTED;
	return true;
}
