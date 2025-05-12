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

export default TypeOutline;
