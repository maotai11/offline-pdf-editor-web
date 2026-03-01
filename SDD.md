# Offline PDF Editor - Software Design Document (SDD)

## 1. Purpose
This document defines the functional scope and design requirements for Offline PDF Editor.
It is the baseline for product planning, implementation, and testing.

## 2. Global Principles
- Offline-first architecture.
- Modular design (file, page, annotation, conversion, security, batch).
- Reversible operations by default, except explicitly destructive actions (for example, redaction).
- Batch-first extension: all single-item operations must provide batch mode.

## 3. Global Additions (Requested)
- Split output supports one-click bulk download.
- Split output naming rule is user-defined from UI.
- Naming format: `{input_prefix}-{serial}`.
- Serial is configurable: start value, digit width (zero padding), increment step.
- Example: `CaseA-001`, `CaseA-002`.
- Any single-operation feature must be extended with a batch operation mode.

## 4. Feature Catalog

### 4.1 File Operations
| Category | Feature | Description |
|---|---|---|
| File Operations | Open / Save / Save As | Drag-and-drop open support; incremental save to reduce write cost on large PDFs |
| File Operations | Merge PDF | Multi-file merge with drag-and-drop reordering |
| File Operations | Split PDF | Split by page range / every N pages / bookmark-based split |
| File Operations | Extract Pages | Export selected pages to a new PDF |
| File Operations | Print | System printing with range, odd/even pages, N-up, poster mode |

### 4.2 Page Operations
| Category | Feature | Description |
|---|---|---|
| Page Operations | Rotate Pages | 90/180/270 degrees, with batch support |
| Page Operations | Delete Pages | Single page / multi-page / page range |
| Page Operations | Reorder Pages | Drag-and-drop page thumbnails |
| Page Operations | Insert Pages | Insert from another PDF / insert blank page |

### 4.3 View Features
| Category | Feature | Description |
|---|---|---|
| View Features | Thumbnail Navigation | Sidebar thumbnails with adjustable size |
| View Features | Zoom | Custom percent / fit width / fit page / two-page |
| View Features | Scroll Modes | Single page / continuous / two-page continuous |
| View Features | Bookmark Navigation | Display and navigate PDF outline tree |

### 4.4 Selection
| Category | Feature | Description |
|---|---|---|
| Selection | Text Selection and Copy | Box/line selection and clipboard copy |
| Selection | Image Region Selection | Select area and export as image |

### 4.5 Editing Basics
| Category | Feature | Description |
|---|---|---|
| Editing Basics | Undo / Redo | Unlimited steps; all reversible operations included |
| Editing Basics | Auto Backup / Crash Recovery | Periodic snapshots and restore after abnormal exit |

### 4.6 Multi-Document
| Category | Feature | Description |
|---|---|---|
| Multi-Document | Tabbed Interface | Open multiple PDFs; tab drag; tab context menu |
| Multi-Document | Cross-Document Drag | Drag pages from document A to document B |

### 4.7 Annotations
| Category | Feature | Description |
|---|---|---|
| Annotations | Highlight | Semi-transparent text marking |
| Annotations | Lines / Arrows | Configurable color and width |
| Annotations | Rectangle / Ellipse | Shape markup |
| Annotations | Sticky Note | Collapsible note annotation |
| Annotations | Free Text | FreeText annotation |
| Annotations | Freehand Drawing | Pen/mouse drawing |
| Annotations | Annotation List Panel | Sidebar list with click-to-jump |

### 4.8 Signatures and Stamps
| Category | Feature | Description |
|---|---|---|
| Signatures and Stamps | Electronic Signature | Transparent PNG upload / drawn signature / signature manager |
| Signatures and Stamps | Stamp | Preset stamps (Reviewed, Approved, Urgent) + custom image stamp |
| Signatures and Stamps | Cross-Page Seal | Auto split and align across pages |
| Signatures and Stamps | Watermark | Text/image watermark with opacity, rotation, position, page range |

### 4.9 Crop
| Category | Feature | Description |
|---|---|---|
| Crop | Page Cropping | Trim white margins / custom crop area |
| Crop | Box Configuration | Set CropBox / TrimBox / BleedBox |

### 4.10 Appearance and Diagnostics
| Category | Feature | Description |
|---|---|---|
| Appearance | Dark Mode | Follow system theme + manual toggle |
| Diagnostics | Error Log | Local diagnostics export for bug reports |

### 4.11 Text Editing
| Category | Feature | Description |
|---|---|---|
| Text Editing | Add Text | Place text with font/size/color/alignment |
| Text Editing | Edit Existing PDF Text | Advanced feature, separate technical track |
| Text Editing | Find Text | Full-text search + highlight + result navigation |
| Text Editing | Replace Text | Batch replacement |

### 4.12 Image Operations
| Category | Feature | Description |
|---|---|---|
| Image Operations | Insert Image | JPG/PNG/BMP/WebP/SVG |
| Image Operations | Extract Embedded Images | Export embedded images from PDF |
| Image Operations | Replace Embedded Image | Keep original position and size |

### 4.13 Forms
| Category | Feature | Description |
|---|---|---|
| Forms | Fill Forms | AcroForm and XFA fields |
| Forms | Create Forms | Text field / checkbox / radio / dropdown / signature field |
| Forms | Form Import/Export | FDF / XFDF / CSV / JSON |

### 4.14 Security
| Category | Feature | Description |
|---|---|---|
| Security | Password Protection | Open password / permissions password (AES-128 / AES-256) |
| Security | Remove Password | Requires original password |
| Security | Permission Control | Disable print/copy/edit/form-fill |
| Security | Digital Signature (Sign) | X.509 signing (PAdES B-B / B-T / B-LT) |
| Security | Digital Signature (Verify) | Signature validity and certificate chain verification |
| Security | Redaction | Permanent irreversible removal of sensitive content |

### 4.15 Conversion
| Category | Feature | Description |
|---|---|---|
| Conversion | PDF to Images | Export each page as PNG/JPG with selectable DPI |
| Conversion | Images to PDF | Batch image merge with page size and margins |
| Conversion | Office to PDF | DOCX/XLSX/PPTX using embedded LibreOffice or external call |
| Conversion | PDF to Text | Direct extraction or OCR-assisted extraction |

### 4.16 Layout and Accessibility
| Category | Feature | Description |
|---|---|---|
| Flattening | Flatten Annotations/Forms | Lock into non-editable page content |
| Alignment Aids | Ruler/Grid | Visual guides and snapping |
| Accessibility | A11y | Full keyboard navigation, high contrast, screen reader labels |

### 4.17 Batch Processing
| Category | Feature | Description |
|---|---|---|
| Batch Processing | Batch Merge | Multi-file batch merge |
| Batch Processing | Batch Watermark | Apply same watermark to multiple files |
| Batch Processing | Batch Encryption | Apply passwords in batch |
| Batch Processing | Batch Conversion | Batch PDF->images / images->PDF |
| Batch Processing | CLI | Scriptable automation and scheduling |

### 4.18 Analysis and Quality
| Category | Feature | Description |
|---|---|---|
| Compare | Document Comparison | Text and visual overlay comparison |
| Compression | File Compression | Lower image quality/DPI, remove metadata/unused objects, linearization |
| OCR | Text Recognition | Scanned PDF to searchable PDF (Tesseract/PaddleOCR) |

### 4.19 Bookmarks and Page Labels
| Category | Feature | Description |
|---|---|---|
| Bookmarks | Edit Bookmarks | Add/delete/rename/reorder |
| Bookmarks | Auto Bookmarking | Build tree from heading styles/font sizes |
| Header/Footer | Page Numbers | Position/format/start number/font controls |
| Header/Footer | Header/Footer | Date, custom text, dynamic variables |
| Header/Footer | Page Labels | i/ii/iii, A-1/A-2, and custom schemes |

### 4.20 Links, Attachments, Metadata, Legal Numbering
| Category | Feature | Description |
|---|---|---|
| Links | Edit Hyperlinks | Add/edit/remove URL and page-jump links |
| Attachments | Manage Embedded Files | Add/extract/delete attachments |
| Metadata | Basic Properties | Title/author/subject/keywords/creation date |
| Metadata | XMP Metadata | Advanced metadata view/edit |
| Bates Numbering | Legal Numbering | Prefix/suffix/digit width/start value |
| PDF/A | Archival Export | PDF/A-1b and PDF/A-2b |

### 4.21 Reading and Interaction
| Category | Feature | Description |
|---|---|---|
| Presentation Mode | Fullscreen Playback | Auto play and page transition effects |
| Reading Mode | Night/Eye-care | Invert/warm/custom background |
| Shortcuts | Custom Shortcut Mapping | User-defined key bindings |
| Touch | Touch Optimization | Touch zoom/scroll/draw for tablet devices |

## 5. Batch Capability Matrix (Global Constraint)
- Page operations: rotate, delete, move, insert, extract, reorder support multi-select/range.
- Annotation operations: add/delete/style/flatten support multi-object apply.
- Document operations: merge, split, encrypt, watermark, compress, convert support multi-file mode.
- Export operations: unified file naming template, serial policy, conflict handling.

## 6. Split Download Spec (Detailed)
- UI inputs:
  - File prefix
  - Serial start
  - Serial width
  - Serial step
  - Download mode (archive or multi-file)
- Naming formula:
  - `finalName = {prefix}-{serial}`
  - `serial = pad(start + index * step, width)`
- Example:
  - Prefix `Invoice`, start `1`, width `4`, step `1`
  - Outputs `Invoice-0001.pdf`, `Invoice-0002.pdf`, ...

## 7. Roadmap Suggestion
- P1: Core file/page/view/annotation/export with batch framework.
- P2: Forms/security/conversion/OCR/compare/compress.
- P3: Advanced signing chain, PDF/A hardening, Office conversion integration, deep accessibility.
