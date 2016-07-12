#pragma once

#include <Windows.h>
#include <duktape.h>

// Global duk context
extern duk_context *ctx;

enum class CallConvention
{
    STDCALL,
    CDECLCALL,
    FASTCALL
};
