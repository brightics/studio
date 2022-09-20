#pragma once

#include <cstddef>
#include <string_view>

#ifdef GVDLL
#if gvc___EXPORTS // CMake's substitution of gvc++_EXPORTS
#define GVRENDER_API __declspec(dllexport)
#else
#define GVRENDER_API __declspec(dllimport)
#endif
#endif

#ifndef GVRENDER_API
#define GVRENDER_API /* nothing */
#endif

namespace GVC {

class GVLayout;

/**
 * @brief The GVRenderData class represents a rendered layout in a specific text
 * format
 */

class GVRENDER_API GVRenderData {
public:
  ~GVRenderData();

  // delete copy for now since we cannot use default because we manage a C
  // string using a raw pointer
  GVRenderData(GVRenderData &) = delete;
  GVRenderData &operator=(GVRenderData &) = delete;

  // delete move for now since we cannot use default because we manage a C
  // string using a raw pointer
  GVRenderData(GVRenderData &&) = delete;
  GVRenderData &operator=(GVRenderData &&) = delete;

  // get the rendered string as a C string. The string is null terminated, but
  // that is not useful for binary formats. Combine with the length method for
  // that case.
  char *c_str() const { return m_data; }

  // get the length of the rendered string
  std::size_t length() const { return m_length; }

  // get the rendered string as a string view
  std::string_view string_view() const {
    return std::string_view{m_data, m_length};
  }

  friend GVLayout;

private:
  // use GVLayout::render to constuct a GVRenderData object
  GVRenderData(char *rendered_data, std::size_t length);

  // the underlying C data structure
  char *m_data = nullptr;
  std::size_t m_length = 0;
};

} //  namespace GVC

#undef GVRENDER_API
