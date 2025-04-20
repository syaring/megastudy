"use client"

import { useEffect, useState } from 'react';

import KatexSpan from './KatexSpan';

import 'katex/dist/katex.min.css';

type TypeOutline = {
  title: string;
  sections: [
    {
      title: string;
      content: string;
      subsections: [
        {
          title: string;
          content: string;
          subsubsections: [
            {
              title: string;
              content: string;
            }
          ];
        }
      ];
    }
  ];
}

export default function Outline ({ data }: {
  data: string;
}) {
  const [outline, setOutline] = useState<TypeOutline | null>(null);

  useEffect(() => {
    if (data !== '') {
      const parsedData = JSON.parse(data);
      setOutline(parsedData);
    }
  }, [data]);

  const regexSmall = /\$.*?\$/g;
  const regexBig = /\$\$.*?\$\$/g;

  const renderContent = (text: string) => {
    const katexBig = text.match(regexBig);
    const newText1 = text.replaceAll(regexBig, ' katexBig ');

    const katexSmall = newText1.match(regexSmall);
    const newText2 = newText1.replaceAll(regexSmall, ' katexSmall ');

    const textArr = newText2.split(' ');

    return textArr.map((t, i) => {
      if (t === 'katexBig') {
        const textBig = katexBig?.pop() || '';

        return  (
          <KatexSpan key={textBig} text={textBig} />
        );
      }

      if (t === 'katexSmall') {
        const textSmall = katexSmall?.pop() || '';

        return <KatexSpan key={textSmall} text={textSmall} />;
      }

      return (
        <span key={i}> {t}</span>
      );
    });
  }

  return (
    outline && (
      <div>
        <h1>{outline.title}</h1>
        <br />
        <div>
          {outline.sections.map(section => {
            return (
              <div key={section.title}>
                <h2>{section.title}</h2>
                <br />
                <p style={{ textIndent: 4 }}>{renderContent(section.content)}</p>
                <br />
                {section.subsections?.length
                  ? section.subsections.map(subsection => {
                      return (
                        <div key={subsection.title}>
                          <h3>{subsection.title}</h3>
                          <br />
                          <p style={{ textIndent: 4 }}>{renderContent(subsection.content)}</p>
                          <br />
                          {subsection.subsubsections?.length
                            ? subsection.subsubsections.map(subsubsection => {
                                return (
                                  <div key={subsubsection.title}>
                                    <h3>{subsubsection.title}</h3>
                                    <br />
                                    <p style={{ textIndent: 4 }}>{renderContent(subsubsection.content)}</p>
                                    <br />
                                  </div>
                                );
                              })
                            : null}
                        </div>
                      );
                    })
                  : null}
              </div>
            );
          })}
        </div>
      </div>
    )
  );
}
