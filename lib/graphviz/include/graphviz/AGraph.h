#pragma once

#include <string>
#include <utility>

#include "cgraph.h"

#ifdef GVDLL
#if cgraph___EXPORTS // CMake's substitution of cgraph++_EXPORTS
#define AGRAPH_API __declspec(dllexport)
#else
#define AGRAPH_API __declspec(dllimport)
#endif
#endif

#ifndef AGRAPH_API
#define AGRAPH_API /* nothing */
#endif

namespace CGraph {

/**
 * @brief The AGraph class represents an abstract graph
 */

class AGRAPH_API AGraph {
public:
  explicit AGraph(const std::string &dot);
  ~AGraph();

  // delete copy since we manage a C struct using a raw pointer and the struct
  // cannot be easily copied since it contains even more raw pointers
  AGraph(const AGraph &) = delete;
  AGraph &operator=(const AGraph &) = delete;

  // implement move since we manage a C struct using a raw pointer
  AGraph(AGraph &&other) noexcept : m_g(std::exchange(other.m_g, nullptr)) {}
  AGraph &operator=(AGraph &&other) noexcept {
    using std::swap;
    swap(m_g, other.m_g);
    return *this;
  }

  // get a non-owning pointer to the underlying C data structure
  Agraph_t *c_struct() const { return m_g; };

private:
  // the underlying C data structure
  Agraph_t *m_g = nullptr;
};

} // namespace CGraph

#undef AGRAPH_API
