#ifndef DOCTYPE_H
#define DOCTYPE_H

#include <stddef.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

/* =========================================================================
 * 1. VERSION & BUFFER CONSTANTS
 * ========================================================================= */
#define DOCTYPE_LIB_VERSION_MAJOR 1
#define DOCTYPE_LIB_VERSION_MINOR 4
#define DOCTYPE_LIB_VERSION_PATCH 0

#define DOCTYPE_MAX_HEADER_LEN    512
#define DOCTYPE_MAX_MIME_LEN      64
#define DOCTYPE_MAX_VERSION_LEN   16
#define DOCTYPE_MAX_PUBLIC_ID_LEN 256
#define DOCTYPE_MAX_SYSTEM_ID_LEN 256

/* Standard W3C Public Identifiers */
#define PUBID_HTML4_STRICT        "-//W3C//DTD HTML 4.01//EN"
#define PUBID_HTML4_TRANSITIONAL  "-//W3C//DTD HTML 4.01 Transitional//EN"
#define PUBID_HTML4_FRAMESET      "-//W3C//DTD HTML 4.01 Frameset//EN"
#define PUBID_XHTML1_STRICT       "-//W3C//DTD XHTML 1.0 Strict//EN"
#define PUBID_XHTML1_TRANSITIONAL "-//W3C//DTD XHTML 1.0 Transitional//EN"
#define PUBID_XHTML11             "-//W3C//DTD XHTML 1.1//EN"
#define PUBID_SVG11               "-//W3C//DTD SVG 1.1//EN"
#define PUBID_MATHML2             "-//W3C//DTD MathML 2.0//EN"

/* =========================================================================
 * 2. ENUMERATIONS (DOCUMENT TYPES, MODES & ERROR CODES)
 * ========================================================================= */

/**
 * Supported document type standards.
 */
typedef enum {
    DOCTYPE_UNKNOWN = 0,
    DOCTYPE_HTML5,
    DOCTYPE_HTML4_STRICT,
    DOCTYPE_HTML4_TRANSITIONAL,
    DOCTYPE_HTML4_FRAMESET,
    DOCTYPE_XHTML1_STRICT,
    DOCTYPE_XHTML1_TRANSITIONAL,
    DOCTYPE_XHTML11,
    DOCTYPE_XML,
    DOCTYPE_SVG11,
    DOCTYPE_MATHML2,
    DOCTYPE_CUSTOM
} DoctypeKind;

/**
 * Browser rendering compatibility modes triggered by the doctype.
 */
typedef enum {
    RENDER_MODE_QUIRKS = 0,          /* Legacy quirks mode */
    RENDER_MODE_ALMOST_STANDARDS,    /* Transitional doctypes */
    RENDER_MODE_FULL_STANDARDS       /* Modern HTML5 / Strict doctypes */
} RenderMode;

/**
 * Status and error codes returned by parser functions.
 */
typedef enum {
    DOCTYPE_OK = 0,
    DOCTYPE_ERR_NULL_POINTER,
    DOCTYPE_ERR_EMPTY_INPUT,
    DOCTYPE_ERR_BUFFER_TOO_SMALL,
    DOCTYPE_ERR_SYNTAX_INVALID,
    DOCTYPE_ERR_UNSUPPORTED_VERSION
} DoctypeStatus;

/* =========================================================================
 * 3. DATA STRUCTURES
 * ========================================================================= */

/**
 * Parser configuration flags.
 */
typedef struct {
    bool case_sensitive;         /* Require uppercase <!DOCTYPE ...> */
    bool allow_leading_space;    /* Allow whitespace before <!DOCTYPE */
    bool strict_public_id;       /* Validate W3C public identifier strictly */
    bool reject_deprecated;      /* Treat legacy HTML4/XHTML as errors */
} DoctypeParserConfig;

/**
 * Complete metadata result after parsing a document header.
 */
typedef struct {
    DoctypeKind kind;
    RenderMode  render_mode;
    bool        is_web_standard;
    bool        is_deprecated;
    bool        is_xml_based;
    char        mime_type[DOCTYPE_MAX_MIME_LEN];
    char        version[DOCTYPE_MAX_VERSION_LEN];
    char        public_id[DOCTYPE_MAX_PUBLIC_ID_LEN];
    char        system_id[DOCTYPE_MAX_SYSTEM_ID_LEN];
} DocumentInfo;

/**
 * Batch statistics when scanning multiple files or headers.
 */
typedef struct {
    size_t total_scanned;
    size_t html5_count;
    size_t legacy_count;
    size_t xml_count;
    size_t unknown_count;
} DoctypeBatchStats;

/* =========================================================================
 * 4. FUNCTION DECLARATIONS (PUBLIC API)
 * ========================================================================= */

/* Configuration helpers */
DoctypeParserConfig doctype_default_config(void);
DoctypeParserConfig doctype_strict_config(void);

/* Core parsing and rendering */
DoctypeKind   doctype_parse_simple(const char *raw_header);
DoctypeStatus doctype_analyze(const char *raw_header,
                              const DoctypeParserConfig *config,
                              DocumentInfo *out_info);

DoctypeStatus doctype_render(DoctypeKind kind,
                             char *out_buffer,
                             size_t buffer_size);

/* Classification and inspection */
bool        doctype_is_web_standard(DoctypeKind kind);
bool        doctype_is_deprecated(DoctypeKind kind);
bool        doctype_is_xml_based(DoctypeKind kind);
RenderMode  doctype_get_render_mode(DoctypeKind kind);
const char* doctype_get_mime_type(DoctypeKind kind);
const char* doctype_kind_to_string(DoctypeKind kind);
const char* doctype_status_to_string(DoctypeStatus status);

/* Batch processing & reporting */
void doctype_stats_init(DoctypeBatchStats *stats);
void doctype_stats_record(DoctypeBatchStats *stats, const DocumentInfo *info);
void doctype_stats_print(const DoctypeBatchStats *stats);

#ifdef __cplusplus
}
#endif

#endif /* DOCTYPE_H */
