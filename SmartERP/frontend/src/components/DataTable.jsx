import React from "react";

export default function DataTable({
  columns = [],
  data = [],
  onEdit,
  onDelete,
  loading = false,
}) {
  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div
      style={{
        overflowX: "auto",
        background: "#fff",
        borderRadius: 10,
        boxShadow: "0 2px 10px rgba(0,0,0,.08)",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead
          style={{
            background: "#1e293b",
            color: "white",
          }}
        >
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                style={{
                  padding: 14,
                  textAlign: "center",
                }}
              >
                {col.label}
              </th>
            ))}

            {(onEdit || onDelete) && (
              <th style={{ padding: 14 }}>Action</th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                style={{
                  textAlign: "center",
                  padding: 25,
                }}
              >
                No Records Found
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={index}
                style={{
                  textAlign: "center",
                  borderBottom: "1px solid #ddd",
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      padding: 12,
                    }}
                  >
                    {row[col.key]}
                  </td>
                ))}

                {(onEdit || onDelete) && (
                  <td style={{ padding: 12 }}>
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        style={{
                          background: "#f59e0b",
                          color: "white",
                          border: "none",
                          padding: "7px 12px",
                          borderRadius: 6,
                          cursor: "pointer",
                          marginRight: 8,
                        }}
                      >
                        Edit
                      </button>
                    )}

                    {onDelete && (
                      <button
                        onClick={() => onDelete(row.id)}
                        style={{
                          background: "#dc2626",
                          color: "white",
                          border: "none",
                          padding: "7px 12px",
                          borderRadius: 6,
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}