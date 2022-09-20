#pragma once

#include <string_view>
#include <utility>

#include "gvc.h"

#ifdef GVDLL
#if gvc___EXPORTS // CMake's substitution of gvc++_EXPORTS
#define GVCONTEXT_API __declspec(dllexport)
#else
#define GVCONTEXT_API __declspec(dllimport)
#endif
#endif

#ifndef GVCONTEXT_API
#define GVCONTEXT_API /* nothing */
#endif

namespace GVC {

/**
 * @brief The GVContext class represents a Graphviz context
 */

class GVCONTEXT_API GVContext {
public:
  GVContext();
  /**
   * @brief GVContext Create a graph context with built-in plugins and
   * optionally load dynamic plugins on demand.
   * @param builtins Array of structs, each containing a pointer to
   * the name and the address of a plugin to load. The end of the array is
   * designated by a struct whose name pointer is NULL.
   * @param demand_loading Enables loading plugins dynamically on
   * demand when true.
   */
  GVContext(const lt_symlist_t *builtins, bool demand_loading);
  ~GVContext();

  // delete copy since we manage a C struct using a raw pointer and the struct
  // cannot be easily copied since it contains even more raw pointers
  GVContext(GVContext &) = delete;
  GVContext &operator=(GVContext &) = delete;

  // implement move since we manage a C struct using a raw pointer
  GVContext(GVContext &&other) noexcept
      : m_gvc(std::exchange(other.m_gvc, nullptr)) {}
  GVContext &operator=(GVContext &&other) noexcept {
    using std::swap;
    swap(m_gvc, other.m_gvc);
    return *this;
  }

  // get a non-owning pointer to the underlying C data structure
  GVC_t *c_struct() const { return m_gvc; }

  std::string_view buildDate() const;
  std::string_view version() const;

private:
  // the underlying C data structure
  GVC_t *m_gvc = nullptr;
};

} // namespace GVC

#undef GVCONTEXT_API
