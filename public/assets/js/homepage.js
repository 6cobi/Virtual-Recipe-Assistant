const { useEffect, useState } = React;

const { Button, Space, Badge, Avatar, message: MyMessage } = antd;
const {
  Attachments,
  Bubble,
  Conversations,
  Prompts,
  Sender,
  Welcome,
  useXAgent,
  useXChat,
  Spin,
} = antdx;

const { FireOutlined } = icons;

const renderTitle = (icon, title) => (
  <Space align="start">
    {icon}
    <span>{title}</span>
  </Space>
);

const placeholderPromptsItems = [
  {
    key: "1",
    label: renderTitle(
      <FireOutlined style={{ color: "#FF4D4F" }} />,
      "Popular Ingredients"
    ),
    description: "Here are some popular ingredient recommendations:",
    children: [
      {
        key: "1-1",
        description: `Chicken➕Rice➕Broccoli`,
      },
      {
        key: "1-2",
        description: `Tuna➕Avocado`,
      },
      {
        key: "1-3",
        description: `Beef➕Onion`,
      },
    ],
  },
];

const roles = {
  ai: {
    placement: "start",
    typing: { step: 2, interval: 50 },
    styles: {
      content: {
        borderRadius: 16,
      },
    },
    avatar: {
      icon: <Avatar src="https://images2.imgbox.com/36/a0/2JXB8luI_o.png" />,
    },
  },
  local: {
    placement: "end",
    variant: "shadow",
    avatar: {
      icon: <Avatar src="https://images2.imgbox.com/9a/03/px4rV8FM_o.png" />,
    },
  },
};

const App = () => {
  const [senderPromptsItems, setSenderPromptsItems] = useState([]);

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess }) => {
      setLoading(true);

      const response = await fetch("/api/processChatRequest", {
        method: "POST",
        body: JSON.stringify({ message }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }).then((rsp) => rsp.json());

      setLoading(false);

      if (!response.success) {
        MyMessage.error("Failed to get response. Please try again later.");
        return;
      }

      onSuccess(response.response);

      await fetch("/api/setHisTorySearch", {
        method: "POST",
        body: JSON.stringify({ content: message }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }).then((rsp) => rsp.json());
      init();
    },
  });

  const { onRequest, messages, setMessages } = useXChat({
    agent,
    requestPlaceholder: "Waiting...",
    requestFallback: "Mock failed return. Please try again later.",
  });

  const items = messages.map(({ id, message, status }) => ({
    key: id,
    loading: status === "loading",
    role: status === "local" ? "local" : "ai",
    content: message,
  }));

  const onPromptsItemClick = (info) => {
    onRequest(info.data.description);
  };

  const onSubmit = (nextContent) => {
    if (!nextContent) return;
    const isValid = /^[a-zA-Z\s]+$/.test(nextContent);

    if (!isValid) {
      MyMessage.warning("Input Invalid, letters and blank spaces only");
      return;
    }

    onRequest(nextContent.trimStart().split(" ").join("➕"));
    setContent("");
  };

  const placeholderNode = (
    <Space direction="vertical" size={16} className="placeholder">
      <Welcome
        variant="borderless"
        icon="https://images2.imgbox.com/36/a0/2JXB8luI_o.png"
        title="I'm Your Virtual Recipe Assistant  👻"
        description="You can tell me the ingredients you have, and I will help you find delicious recipes!"
      />
      <Prompts
        items={placeholderPromptsItems}
        styles={{
          list: {
            width: "100%",
          },
          item: {
            flex: 1,
          },
        }}
        onItemClick={onPromptsItemClick}
      />
    </Space>
  );

  const init = async () => {
    const data = await fetch("/api/getHisTorySearch", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((rsp) => rsp.json());

    setSenderPromptsItems(
      data
        .map((item, index) => ({
          key: index,
          description: item.content.split(" ").join("➕"),
        }))
        .reverse()
    );
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="chat">
      <Bubble.List
        items={
          items.length > 0
            ? items
            : [{ content: placeholderNode, variant: "borderless" }]
        }
        roles={roles}
        className="messages"
      />
      <Prompts
        title="🙂‍↔️ Your Search Histories:"
        items={senderPromptsItems}
        onItemClick={onPromptsItemClick}
      />
      <Sender
        loading={loading}
        value={content}
        onSubmit={onSubmit}
        onChange={setContent}
        className="sender"
        placeholder="Please enter ingredient names (separate multiple names with spaces)"
      />
    </div>
  );
};
ReactDOM.render(<App />, document.getElementById("root"));
