import React, {useState} from 'react';

const topics = [
  ['math', 'Math'],
  ['ml', 'ML'],
];

export default function PublicationList({children}) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const publications = React.Children.toArray(children).filter(
    (child) => selectedTopic === null
      || (React.isValidElement(child) && child.props['data-topic'] === selectedTopic),
  );

  return (
    <>
      <div className="publication-filters" role="group" aria-label="Filter publications by topic">
        {topics.map(([topic, label]) => (
          <button
            key={topic}
            type="button"
            aria-pressed={selectedTopic === topic}
            onClick={() => setSelectedTopic((current) => current === topic ? null : topic)}>
            {label}
          </button>
        ))}
      </div>
      {publications}
    </>
  );
}
