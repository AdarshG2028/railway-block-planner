import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { assetsQuery } from "@/lib/queries";
import {
  AsyncBlock,
  DataTable,
  Field,
  PageHeader,
  Pager,
  Panel,
  SelectInput,
  TextInput,
} from "@/components/control";
import { fmtDate, fmtNum } from "@/lib/format";

export const Route = createFileRoute("/assets/")({
  head: () => ({ meta: [{ title: "Assets — Railway AI Block Planner" }] }),
  component: Assets,
});

const PAGE_SIZE = 50;

function Assets() {
  const { data, isLoading, error } = useQuery(assetsQuery);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);

  const types = useMemo(
    () => [...new Set((data ?? []).map((a) => a.asset_type).filter(Boolean))].sort(),
    [data],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data ?? []).filter(
      (a) =>
        (!type || a.asset_type === type) &&
        (!q ||
          a.asset_id.toLowerCase().includes(q) ||
          (a.station_code ?? "").toLowerCase().includes(q) ||
          (a.station_name ?? "").toLowerCase().includes(q)),
    );
  }, [data, search, type]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="ASSET REGISTER"
        title="Railway assets"
        intro="Track, bridge, level crossing, OHE, signal and point machine assets with age and condition. Open one for inspections, failures, maintenance and ML risk."
      />

      <Panel
        title="Filters"
        right={`${filtered.length.toLocaleString("en-IN")} OF ${(data?.length ?? 0).toLocaleString("en-IN")}`}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Search">
            <TextInput
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Asset ID, station code or name"
            />
          </Field>
          <Field label="Asset type">
            <SelectInput
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All types</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </SelectInput>
          </Field>
        </div>
      </Panel>

      <Panel title="Assets">
        <AsyncBlock
          isLoading={isLoading}
          error={error}
          data={data}
          isEmpty={(d) => d.length === 0}
          loadingLabel="Loading asset register…"
          emptyTitle="No assets imported"
          emptyHint="Upload assets.csv from the Data page."
        >
          {() =>
            rows.length ? (
              <>
                <DataTable
                  head={[
                    "Asset",
                    "Type",
                    "Station",
                    "Installed",
                    "Age (y)",
                    "Expected life (y)",
                    "Initial condition",
                  ]}
                >
                  {rows.map((a) => (
                    <tr key={a.asset_id}>
                      <td>
                        <Link
                          to="/assets/$assetId"
                          params={{ assetId: a.asset_id }}
                          className="text-signal hover:underline"
                        >
                          {a.asset_id}
                        </Link>
                      </td>
                      <td>{a.asset_type ?? "—"}</td>
                      <td>
                        {a.station_code ?? "—"}
                        {a.station_name ? (
                          <span className="text-steel"> · {a.station_name}</span>
                        ) : null}
                      </td>
                      <td className="text-steel">{fmtDate(a.installation_date)}</td>
                      <td>{fmtNum(a.asset_age_years)}</td>
                      <td>{fmtNum(a.expected_life_years)}</td>
                      <td>{fmtNum(a.initial_condition_score)}</td>
                    </tr>
                  ))}
                </DataTable>
                <Pager
                  page={current}
                  totalPages={totalPages}
                  total={filtered.length}
                  onPage={setPage}
                />
              </>
            ) : (
              <p className="font-mono text-[11px] text-steel">No assets match these filters.</p>
            )
          }
        </AsyncBlock>
      </Panel>
    </div>
  );
}
