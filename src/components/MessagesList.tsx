import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { BanIcon, BellIcon, CheckIcon, CrossIcon, DoubleBlueCheckIcon, DoubleCheckIcon, PhoneIcon } from '../assets/icons';
import { formatDate, getParticipantColor, shouldRenderDateSeparator } from '../helpers';
import { WChat, WMessage } from '../interfaces';
import { WMessageType } from '../interfaces/enums';
import { useMessageContextMenu } from '../context/useMessageContextMenu';
import { editMessage, deleteMessage as doDeleteMessage } from '../services/whatsapp';
import axios from 'axios';
import { message, Modal, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { WHATSAPP_API_URL } from '../utils/urls';
interface MessageListProps {
  messages: WMessage[];
  selectedChat: WChat | null;
  setMessages: Dispatch<SetStateAction<WMessage[]>>;
  setQuotedMessage: Dispatch<SetStateAction<WMessage | null>>;
}

export const MessagesList: React.FC<MessageListProps> = ({ messages, selectedChat, setMessages, setQuotedMessage }) => {
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const [messageToEdit, setMessageToEdit] = useState<WMessage | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [loadingEditMessage, setLoadingEditMessage] = useState<boolean>(false);

  const [deleteMessage, setDeleteMessage] = useState<WMessage | null>(null);
  const [modalDeleteMessage, setModalDeleteMessage] = useState<boolean>(false);
  const [loadingDeleteMessage, setLoadingDeleteMessage] = useState<boolean>(false);

  const handleContextMenu = useMessageContextMenu({
    setQuotedMessage,
    setMessageToEdit,
    setEditText,
    setDeleteMessage,
    setModalDeleteMessage,
  });

  const handleEditMessage = async (messageId: string) => {
    try {
      setLoadingEditMessage(true);
      await editMessage(messageId, editText);

      const updatedMessages = await axios.get(`${WHATSAPP_API_URL}/messages/chat-messages/${selectedChat?.id}`);
      setMessages((prev) => [
        ...prev.filter((m) => m.chatId !== selectedChat?.id),
        ...updatedMessages.data.messages.map((msg: WMessage) => ({ ...msg, chatId: selectedChat?.id })),
      ]);

      message.info('Se ha editado el mensaje correctamente');
    } catch {
      message.error('No se puede editar el mensaje porque tiene más de 5 minutos');
    } finally {
      setMessageToEdit(null);
      setEditText('');
      setLoadingEditMessage(false);
    }
  };

  const handleDeleteMessage = async () => {
    try {
      setLoadingDeleteMessage(true);
      await doDeleteMessage(deleteMessage?.id?._serialized);

      setTimeout(async () => {
        const updatedMessages = await axios.get(`${WHATSAPP_API_URL}/messages/chat-messages/${selectedChat?.id}`);
        setMessages((prev) => [
          ...prev.filter((m) => m.chatId !== selectedChat?.id),
          ...updatedMessages.data.messages.map((msg: WMessage) => ({ ...msg, chatId: selectedChat?.id })),
        ]);
      }, 1000);

      message.info('Se ha borrado el mensaje correctamente');
    } catch {
      message.error('No se ha podido eliminar el mensaje');
    } finally {
      setLoadingDeleteMessage(false);
      setModalDeleteMessage(false);
      setDeleteMessage(null);
    }
  };

  const renderFilePreview = (mimetype: string, mediaUrl: string) => {
    if (mimetype?.startsWith('image/')) {
      return <img src={mediaUrl} alt="media" className="max-w-[400px] max-h-[400px] rounded-lg" />;
    }
    if (mimetype?.startsWith('audio/')) {
      return (
        <audio controls className="max-w-[400px]">
          <source src={mediaUrl} type={mimetype} />
          Your browser does not support the audio element.
        </audio>
      );
    }
    if (mimetype?.startsWith('video/')) {
      return (
        <video controls className="max-w-[400px]">
          <source src={mediaUrl} type={mimetype} />
          Your browser does not support the video element.
        </video>
      );
    }
    if (mimetype === 'application/pdf') {
      return (
        <div className="flex flex-col gap-2">
          <iframe src={mediaUrl} className="w-full h-[400px] rounded-lg border-none" title="PDF Preview" />
          <a href={mediaUrl} download="file.pdf" className="p-2 bg-blue-500 text-white rounded-lg text-xs text-center">
            Descargar PDF
          </a>
        </div>
      );
    }
    return (
      <a
        href={mediaUrl}
        download={`file.${mimetype?.split('/')[1]}`}
        className="p-2 bg-blue-500 text-white rounded-lg text-xs"
      >
        Descargar archivo
      </a>
    );
  };

  const renderMessageType = (message: WMessage) => {
    if (message.type === WMessageType.CallLog) {
      return (
        <div className="flex items-center gap-3 rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 shadow-lg hover:bg-gray-750 transition-colors">
          <PhoneIcon className="w-5 h-5 text-blue-400" />
          <span className="text-sm text-gray-300">Llamada realizada</span>
        </div>
      );
    }

    if (message.type === WMessageType.Notification) {
      return (
        <div className="flex items-center gap-3 rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 shadow-lg hover:bg-gray-750 transition-colors">
          <BellIcon className="w-5 h-5 text-purple-400" />
          <span className="text-sm text-gray-300">Notificación de WhatsApp</span>
        </div>
      );
    }

    const { attachedContact } = message;
    if (message.type === WMessageType.VCard && attachedContact) {
      return (
        <div className="flex items-center gap-3 rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 shadow-lg hover:bg-gray-750 transition-colors">
          {attachedContact.img && (
            <img src={attachedContact.img} alt="contact" className="w-8 h-8 rounded-full border-2 border-blue-400" />
          )}

          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-300">{attachedContact.name}</p>
            <p className="text-xs text-gray-400">{attachedContact.phone}</p>
          </div>
        </div>
      );
    }

    if (message.type === WMessageType.Revoked) {
      return (
        <div className="flex items-center gap-3 rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 shadow-lg hover:bg-gray-750 transition-colors">
          <BanIcon className="w-5 h-5 text-red-400" />
          <span className="text-sm text-gray-300">Mensaje eliminado</span>
        </div>
      );
    }
  };

  const renderMessageFormat = (message: WMessage) => {
    if (messageToEdit && message.id === messageToEdit.id) {
      return (
        <div className="flex items-center mt-4 text-white rounded-lg gap-2">
          <textarea
            defaultValue={message.body}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="bg-white text-black border-none focus:outline-none w-full px-2 rounded-lg"
          />

          <button
            className="ml-4 p-2 w-9 h-9 bg-red-600 rounded-full hover:bg-red-700 transition-colors flex items-center justify-center shrink-0"
            onClick={() => {
              setMessageToEdit(null);
              setEditText('');
            }}
          >
            <CrossIcon />
          </button>

          <button
            className="p-2 w-9 h-9 bg-green-600 rounded-full hover:bg-green-700 transition-colors flex items-center justify-center shrink-0"
            onClick={() => handleEditMessage(message.id._serialized)}
          >
            {loadingEditMessage ? <Spin indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />} /> : <CheckIcon />}
          </button>
        </div>
      );
    }

    if (message.link) {
      const link = message.link;

      return (
        <a href={link.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          {message.body}
        </a>
      );
    }

    if (message.mentionedContacts.length > 0) {
      const formatMentions = (body: string, mentionedContacts: { id: string; user: string; name: string }[]) => {
        return body.replace(/@(\d+)/g, (match, id) => {
          const mentionedContact = mentionedContacts.find((contact) => contact.user === id);
          return mentionedContact ? `<b class="font-bold text-blue-500">@${mentionedContact.name}</b>` : match;
        });
      };

      return (
        <p
          dangerouslySetInnerHTML={{
            __html: formatMentions(message.body.replace(/\n/g, '<br />'), message.mentionedContacts),
          }}
        />
      );
    }

    return <p dangerouslySetInnerHTML={{ __html: message.body.replace(/\n/g, '<br />') }} />;
  };

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleQuotedMessageClick = (quotedMessageId: string | undefined) => {
    if (!quotedMessageId) return;

    const quotedMessageElement = messageRefs.current[quotedMessageId];
    if (quotedMessageElement) {
      quotedMessageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

      setHighlightedMessageId(quotedMessageId);

      setTimeout(() => {
        setHighlightedMessageId(null);
      }, 2000);
    }
  };

  return (
    <div
      ref={messageContainerRef}
      className="messages flex-1 p-2 overflow-y-auto overflow-x-hidden flex-col-reverse whats-list-scrollbar"
    >
      <Modal
        title="Eliminar mensaje para todos"
        open={modalDeleteMessage}
        onOk={handleDeleteMessage}
        onCancel={() => {
          setModalDeleteMessage(false);
          setDeleteMessage(null);
        }}
        loading={loadingDeleteMessage}
      >
        <h1>¿Seguro que quieres borrar el mensaje?</h1>
      </Modal>
      {selectedChat &&
        messages
          .filter((msg) => msg.chatId === selectedChat.id)
          .map((message, index, filteredMessages) => {
            const currentTimestamp = message.timestamp;
            const previousTimestamp = index > 0 ? filteredMessages[index - 1].timestamp : null;
            const renderDateSeparator = shouldRenderDateSeparator(currentTimestamp, previousTimestamp);

            // Determine if we should show the sender's name (only for group chats)
            const showSenderName = selectedChat.isGroup && !message.fromMe;
            const senderName = message.contactName || message.senderPhone;
            const isSameSenderAsPrevious = index > 0 && filteredMessages[index - 1].senderId === message.senderId;
            const senderColor = showSenderName ? getParticipantColor(message.senderId) : 'text-gray-700';

            return (
              <div
                key={message.id._serialized}
                ref={(el) => (messageRefs.current[message.id._serialized] = el)}
                onContextMenu={(e) => handleContextMenu(e, message)}
                className={`message transition-colors duration-500 ${
                  highlightedMessageId === message.id._serialized ? 'bg-blue-300' : 'bg-transparent'
                }`}
              >
                {renderDateSeparator && (
                  <div className="messages-date flex justify-center my-4">
                    <div className="messages-date px-3 py-1 bg-gray-300 text-gray-700 rounded-full text-sm">
                      {formatDate(currentTimestamp)}
                    </div>
                  </div>
                )}

                <div
                  className={`messages-background flex ${message.fromMe ? 'justify-end' : 'justify-start'} my-2 mx-[10%]`}
                >
                  <div
                    className={`px-2 py-1 text-sm rounded-xl ${
                      message.fromMe ? 'bg-green-100' : 'bg-white'
                    } max-w-lg shadow flex flex-col gap-1`}
                    style={{ minHeight: '32px' }}
                  >
                    {/* Render quoted message if it exists */}
                    {message.quotedMessage && (
                      <div
                        className="quoted-message bg-gray-100 p-2 rounded-lg border-l-4 border-blue-500 cursor-pointer"
                        onClick={() => handleQuotedMessageClick(message?.quotedMessage?.id?._serialized)}
                      >
                        <div className="text-xs text-gray-600 mb-1">
                          Respondiendo a{' '}
                          <span className="font-semibold">{message.quotedMessage.fromMe ? 'Tú' : senderName}</span>
                        </div>
                        {message.quotedMessage.hasMedia && message.quotedMessage.mediaUrl ? (
                          <div className="media-preview">
                            {message.quotedMessage.mimetype?.startsWith('image/') ? (
                              <img
                                src={message.quotedMessage.mediaUrl}
                                alt="Quoted media"
                                className="max-w-[80px] max-h-[80px] rounded"
                              />
                            ) : message.quotedMessage.mimetype?.startsWith('video/') ? (
                              <video
                                src={message.quotedMessage.mediaUrl}
                                controls
                                className="max-w-[80px] max-h-[80px] rounded"
                              />
                            ) : (
                              <div className="file-preview">
                                <span className="text-xs text-gray-700">Archivo adjunto</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-700 truncate">{message.quotedMessage.body}</p>
                        )}
                      </div>
                    )}

                    {/* Render sender's name (for group chats) */}
                    {showSenderName && !isSameSenderAsPrevious && (
                      <p className={`text-sm font-semibold ${senderColor}`}>{senderName}</p>
                    )}

                    {/* Render message content */}
                    {Object.values(WMessageType).includes(message.type) ? (
                      <>{renderMessageType(message)} </>
                    ) : message.hasMedia && message.mimetype ? (
                      <div className="flex flex-col gap-2">
                        {renderFilePreview(message.mimetype, message.mediaUrl!)}
                        {renderMessageFormat(message)}
                      </div>
                    ) : (
                      <>{renderMessageFormat(message)}</>
                    )}

                    {/* Render message timestamp and read status */}
                    <div className="text-xs text-gray-500 bottom-1 right-2 flex items-center justify-end">
                      {new Date(message.timestamp * 1000).toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })}
                      {message.fromMe && (
                        <span className="ml-1">{message.viewed ? <DoubleBlueCheckIcon /> : <DoubleCheckIcon />}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
    </div>
  );
};
