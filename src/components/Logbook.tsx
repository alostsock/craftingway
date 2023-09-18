import "./Logbook.scss";

import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Link, useLocation } from "wouter";

import { LogbookState } from "../lib/logbook-state";
import DocumentTitle from "./DocumentTitle";
import RotationMiniDisplay from "./RotationMiniDisplay";

const ENTRIES_PER_PAGE = 5;

const Logbook = observer(function Logbook({ page: pageParam }: { page?: string }) {
  useEffect(() => runInAction(() => LogbookState.refresh()), []);

  const currentPage = parsePageNumber(pageParam);
  const lastPage = Math.ceil(LogbookState.entries.length / ENTRIES_PER_PAGE);

  const [_, setLocation] = useLocation();
  if (currentPage > lastPage) {
    setLocation("/logbook", { replace: true });
  }

  const pages = Array.from(Array(lastPage).keys()).map((i) => i + 1);
  const offset = (currentPage - 1) * ENTRIES_PER_PAGE;

  return (
    <div className="Logbook">
      <DocumentTitle prefix={currentPage > 1 ? `Page ${currentPage}` : undefined} />

      <section>
        <h1>Logbook</h1>
        <p>Recently viewed saved rotations will appear here.</p>

        {pages.length > 1 && (
          <div className="pager">
            <span>Page:</span>
            {pages.map((page) =>
              currentPage === page ? (
                <span key={page}>{page}</span>
              ) : (
                <Link key={page} href={page > 1 ? `/logbook/${page}` : "/logbook"}>
                  {page}
                </Link>
              )
            )}
          </div>
        )}
      </section>

      <section className="entries">
        {LogbookState.entries.length === 0 ? (
          <div className="no-entries">No entries</div>
        ) : (
          LogbookState.entries
            .slice(offset, offset + ENTRIES_PER_PAGE)
            .map(({ hash, slug, data }) => (
              <RotationMiniDisplay key={hash} slug={slug} rotationData={data} />
            ))
        )}
      </section>
    </div>
  );
});

export default Logbook;

function parsePageNumber(pageParam?: string): number {
  const pageNum = parseInt(pageParam ?? "");
  return pageNum >= 1 ? pageNum : 1;
}
