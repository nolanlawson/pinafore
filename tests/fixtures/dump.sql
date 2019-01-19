--
-- PostgreSQL database dump
--

-- Dumped from database version 10.3
-- Dumped by pg_dump version 10.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: timestamp_id(text); Type: FUNCTION; Schema: public; Owner: pinafore
--

CREATE FUNCTION public.timestamp_id(table_name text) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
  DECLARE
    time_part bigint;
    sequence_base bigint;
    tail bigint;
  BEGIN
    time_part := (
      -- Get the time in milliseconds
      ((date_part('epoch', now()) * 1000))::bigint
      -- And shift it over two bytes
      << 16);

    sequence_base := (
      'x' ||
      -- Take the first two bytes (four hex characters)
      substr(
        -- Of the MD5 hash of the data we documented
        md5(table_name ||
          '41569431c71b583685001be129fe54b0' ||
          time_part::text
        ),
        1, 4
      )
    -- And turn it into a bigint
    )::bit(16)::bigint;

    -- Finally, add our sequence number to our base, and chop
    -- it to the last two bytes
    tail := (
      (sequence_base + nextval(table_name || '_id_seq'))
      & 65535);

    -- Return the time part and the sequence part. OR appears
    -- faster here than addition, but they're equivalent:
    -- time_part has no trailing two bytes, and tail is only
    -- the last two bytes.
    RETURN time_part | tail;
  END
$$;


ALTER FUNCTION public.timestamp_id(table_name text) OWNER TO pinafore;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: account_conversations; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.account_conversations (
    id bigint NOT NULL,
    account_id bigint,
    conversation_id bigint,
    participant_account_ids bigint[] DEFAULT '{}'::bigint[] NOT NULL,
    status_ids bigint[] DEFAULT '{}'::bigint[] NOT NULL,
    last_status_id bigint,
    lock_version integer DEFAULT 0 NOT NULL,
    unread boolean DEFAULT false NOT NULL
);


ALTER TABLE public.account_conversations OWNER TO pinafore;

--
-- Name: account_conversations_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.account_conversations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_conversations_id_seq OWNER TO pinafore;

--
-- Name: account_conversations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.account_conversations_id_seq OWNED BY public.account_conversations.id;


--
-- Name: account_domain_blocks; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.account_domain_blocks (
    id bigint NOT NULL,
    domain character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    account_id bigint
);


ALTER TABLE public.account_domain_blocks OWNER TO pinafore;

--
-- Name: account_domain_blocks_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.account_domain_blocks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_domain_blocks_id_seq OWNER TO pinafore;

--
-- Name: account_domain_blocks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.account_domain_blocks_id_seq OWNED BY public.account_domain_blocks.id;


--
-- Name: account_moderation_notes; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.account_moderation_notes (
    id bigint NOT NULL,
    content text NOT NULL,
    account_id bigint NOT NULL,
    target_account_id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.account_moderation_notes OWNER TO pinafore;

--
-- Name: account_moderation_notes_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.account_moderation_notes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_moderation_notes_id_seq OWNER TO pinafore;

--
-- Name: account_moderation_notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.account_moderation_notes_id_seq OWNED BY public.account_moderation_notes.id;


--
-- Name: account_pins; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.account_pins (
    id bigint NOT NULL,
    account_id bigint,
    target_account_id bigint,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.account_pins OWNER TO pinafore;

--
-- Name: account_pins_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.account_pins_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_pins_id_seq OWNER TO pinafore;

--
-- Name: account_pins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.account_pins_id_seq OWNED BY public.account_pins.id;


--
-- Name: accounts; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.accounts (
    id bigint NOT NULL,
    username character varying DEFAULT ''::character varying NOT NULL,
    domain character varying,
    secret character varying DEFAULT ''::character varying NOT NULL,
    private_key text,
    public_key text DEFAULT ''::text NOT NULL,
    remote_url character varying DEFAULT ''::character varying NOT NULL,
    salmon_url character varying DEFAULT ''::character varying NOT NULL,
    hub_url character varying DEFAULT ''::character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    note text DEFAULT ''::text NOT NULL,
    display_name character varying DEFAULT ''::character varying NOT NULL,
    uri character varying DEFAULT ''::character varying NOT NULL,
    url character varying,
    avatar_file_name character varying,
    avatar_content_type character varying,
    avatar_file_size integer,
    avatar_updated_at timestamp without time zone,
    header_file_name character varying,
    header_content_type character varying,
    header_file_size integer,
    header_updated_at timestamp without time zone,
    avatar_remote_url character varying,
    subscription_expires_at timestamp without time zone,
    silenced boolean DEFAULT false NOT NULL,
    suspended boolean DEFAULT false NOT NULL,
    locked boolean DEFAULT false NOT NULL,
    header_remote_url character varying DEFAULT ''::character varying NOT NULL,
    statuses_count integer DEFAULT 0 NOT NULL,
    followers_count integer DEFAULT 0 NOT NULL,
    following_count integer DEFAULT 0 NOT NULL,
    last_webfingered_at timestamp without time zone,
    inbox_url character varying DEFAULT ''::character varying NOT NULL,
    outbox_url character varying DEFAULT ''::character varying NOT NULL,
    shared_inbox_url character varying DEFAULT ''::character varying NOT NULL,
    followers_url character varying DEFAULT ''::character varying NOT NULL,
    protocol integer DEFAULT 0 NOT NULL,
    memorial boolean DEFAULT false NOT NULL,
    moved_to_account_id bigint,
    featured_collection_url character varying,
    fields jsonb,
    actor_type character varying
);


ALTER TABLE public.accounts OWNER TO pinafore;

--
-- Name: accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.accounts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.accounts_id_seq OWNER TO pinafore;

--
-- Name: accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.accounts_id_seq OWNED BY public.accounts.id;


--
-- Name: admin_action_logs; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.admin_action_logs (
    id bigint NOT NULL,
    account_id bigint,
    action character varying DEFAULT ''::character varying NOT NULL,
    target_type character varying,
    target_id bigint,
    recorded_changes text DEFAULT ''::text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.admin_action_logs OWNER TO pinafore;

--
-- Name: admin_action_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.admin_action_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.admin_action_logs_id_seq OWNER TO pinafore;

--
-- Name: admin_action_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.admin_action_logs_id_seq OWNED BY public.admin_action_logs.id;


--
-- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.ar_internal_metadata OWNER TO pinafore;

--
-- Name: backups; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.backups (
    id bigint NOT NULL,
    user_id bigint,
    dump_file_name character varying,
    dump_content_type character varying,
    dump_file_size integer,
    dump_updated_at timestamp without time zone,
    processed boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.backups OWNER TO pinafore;

--
-- Name: backups_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.backups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.backups_id_seq OWNER TO pinafore;

--
-- Name: backups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.backups_id_seq OWNED BY public.backups.id;


--
-- Name: blocks; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.blocks (
    id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    account_id bigint NOT NULL,
    target_account_id bigint NOT NULL,
    uri character varying
);


ALTER TABLE public.blocks OWNER TO pinafore;

--
-- Name: blocks_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.blocks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.blocks_id_seq OWNER TO pinafore;

--
-- Name: blocks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.blocks_id_seq OWNED BY public.blocks.id;


--
-- Name: conversation_mutes; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.conversation_mutes (
    id bigint NOT NULL,
    conversation_id bigint NOT NULL,
    account_id bigint NOT NULL
);


ALTER TABLE public.conversation_mutes OWNER TO pinafore;

--
-- Name: conversation_mutes_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.conversation_mutes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.conversation_mutes_id_seq OWNER TO pinafore;

--
-- Name: conversation_mutes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.conversation_mutes_id_seq OWNED BY public.conversation_mutes.id;


--
-- Name: conversations; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.conversations (
    id bigint NOT NULL,
    uri character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.conversations OWNER TO pinafore;

--
-- Name: conversations_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.conversations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.conversations_id_seq OWNER TO pinafore;

--
-- Name: conversations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.conversations_id_seq OWNED BY public.conversations.id;


--
-- Name: custom_emojis; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.custom_emojis (
    id bigint NOT NULL,
    shortcode character varying DEFAULT ''::character varying NOT NULL,
    domain character varying,
    image_file_name character varying,
    image_content_type character varying,
    image_file_size integer,
    image_updated_at timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    disabled boolean DEFAULT false NOT NULL,
    uri character varying,
    image_remote_url character varying,
    visible_in_picker boolean DEFAULT true NOT NULL
);


ALTER TABLE public.custom_emojis OWNER TO pinafore;

--
-- Name: custom_emojis_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.custom_emojis_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.custom_emojis_id_seq OWNER TO pinafore;

--
-- Name: custom_emojis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.custom_emojis_id_seq OWNED BY public.custom_emojis.id;


--
-- Name: custom_filters; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.custom_filters (
    id bigint NOT NULL,
    account_id bigint,
    expires_at timestamp without time zone,
    phrase text DEFAULT ''::text NOT NULL,
    context character varying[] DEFAULT '{}'::character varying[] NOT NULL,
    irreversible boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    whole_word boolean DEFAULT true NOT NULL
);


ALTER TABLE public.custom_filters OWNER TO pinafore;

--
-- Name: custom_filters_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.custom_filters_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.custom_filters_id_seq OWNER TO pinafore;

--
-- Name: custom_filters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.custom_filters_id_seq OWNED BY public.custom_filters.id;


--
-- Name: domain_blocks; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.domain_blocks (
    id bigint NOT NULL,
    domain character varying DEFAULT ''::character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    severity integer DEFAULT 0,
    reject_media boolean DEFAULT false NOT NULL,
    reject_reports boolean DEFAULT false NOT NULL
);


ALTER TABLE public.domain_blocks OWNER TO pinafore;

--
-- Name: domain_blocks_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.domain_blocks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.domain_blocks_id_seq OWNER TO pinafore;

--
-- Name: domain_blocks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.domain_blocks_id_seq OWNED BY public.domain_blocks.id;


--
-- Name: email_domain_blocks; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.email_domain_blocks (
    id bigint NOT NULL,
    domain character varying DEFAULT ''::character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.email_domain_blocks OWNER TO pinafore;

--
-- Name: email_domain_blocks_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.email_domain_blocks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.email_domain_blocks_id_seq OWNER TO pinafore;

--
-- Name: email_domain_blocks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.email_domain_blocks_id_seq OWNED BY public.email_domain_blocks.id;


--
-- Name: favourites; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.favourites (
    id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    account_id bigint NOT NULL,
    status_id bigint NOT NULL
);


ALTER TABLE public.favourites OWNER TO pinafore;

--
-- Name: favourites_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.favourites_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.favourites_id_seq OWNER TO pinafore;

--
-- Name: favourites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.favourites_id_seq OWNED BY public.favourites.id;


--
-- Name: follow_requests; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.follow_requests (
    id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    account_id bigint NOT NULL,
    target_account_id bigint NOT NULL,
    show_reblogs boolean DEFAULT true NOT NULL,
    uri character varying
);


ALTER TABLE public.follow_requests OWNER TO pinafore;

--
-- Name: follow_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.follow_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.follow_requests_id_seq OWNER TO pinafore;

--
-- Name: follow_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.follow_requests_id_seq OWNED BY public.follow_requests.id;


--
-- Name: follows; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.follows (
    id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    account_id bigint NOT NULL,
    target_account_id bigint NOT NULL,
    show_reblogs boolean DEFAULT true NOT NULL,
    uri character varying
);


ALTER TABLE public.follows OWNER TO pinafore;

--
-- Name: follows_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.follows_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.follows_id_seq OWNER TO pinafore;

--
-- Name: follows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.follows_id_seq OWNED BY public.follows.id;


--
-- Name: identities; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.identities (
    id integer NOT NULL,
    user_id integer,
    provider character varying DEFAULT ''::character varying NOT NULL,
    uid character varying DEFAULT ''::character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.identities OWNER TO pinafore;

--
-- Name: identities_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.identities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.identities_id_seq OWNER TO pinafore;

--
-- Name: identities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.identities_id_seq OWNED BY public.identities.id;


--
-- Name: imports; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.imports (
    id bigint NOT NULL,
    type integer NOT NULL,
    approved boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    data_file_name character varying,
    data_content_type character varying,
    data_file_size integer,
    data_updated_at timestamp without time zone,
    account_id bigint NOT NULL
);


ALTER TABLE public.imports OWNER TO pinafore;

--
-- Name: imports_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.imports_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.imports_id_seq OWNER TO pinafore;

--
-- Name: imports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.imports_id_seq OWNED BY public.imports.id;


--
-- Name: invites; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.invites (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    code character varying DEFAULT ''::character varying NOT NULL,
    expires_at timestamp without time zone,
    max_uses integer,
    uses integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    autofollow boolean DEFAULT false NOT NULL
);


ALTER TABLE public.invites OWNER TO pinafore;

--
-- Name: invites_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.invites_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.invites_id_seq OWNER TO pinafore;

--
-- Name: invites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.invites_id_seq OWNED BY public.invites.id;


--
-- Name: list_accounts; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.list_accounts (
    id bigint NOT NULL,
    list_id bigint NOT NULL,
    account_id bigint NOT NULL,
    follow_id bigint NOT NULL
);


ALTER TABLE public.list_accounts OWNER TO pinafore;

--
-- Name: list_accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.list_accounts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.list_accounts_id_seq OWNER TO pinafore;

--
-- Name: list_accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.list_accounts_id_seq OWNED BY public.list_accounts.id;


--
-- Name: lists; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.lists (
    id bigint NOT NULL,
    account_id bigint NOT NULL,
    title character varying DEFAULT ''::character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.lists OWNER TO pinafore;

--
-- Name: lists_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.lists_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lists_id_seq OWNER TO pinafore;

--
-- Name: lists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.lists_id_seq OWNED BY public.lists.id;


--
-- Name: media_attachments; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.media_attachments (
    id bigint NOT NULL,
    status_id bigint,
    file_file_name character varying,
    file_content_type character varying,
    file_file_size integer,
    file_updated_at timestamp without time zone,
    remote_url character varying DEFAULT ''::character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    shortcode character varying,
    type integer DEFAULT 0 NOT NULL,
    file_meta json,
    account_id bigint,
    description text
);


ALTER TABLE public.media_attachments OWNER TO pinafore;

--
-- Name: media_attachments_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.media_attachments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.media_attachments_id_seq OWNER TO pinafore;

--
-- Name: media_attachments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.media_attachments_id_seq OWNED BY public.media_attachments.id;


--
-- Name: mentions; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.mentions (
    id bigint NOT NULL,
    status_id bigint,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    account_id bigint,
    silent boolean DEFAULT false NOT NULL
);


ALTER TABLE public.mentions OWNER TO pinafore;

--
-- Name: mentions_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.mentions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mentions_id_seq OWNER TO pinafore;

--
-- Name: mentions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.mentions_id_seq OWNED BY public.mentions.id;


--
-- Name: mutes; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.mutes (
    id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    account_id bigint NOT NULL,
    target_account_id bigint NOT NULL,
    hide_notifications boolean DEFAULT true NOT NULL
);


ALTER TABLE public.mutes OWNER TO pinafore;

--
-- Name: mutes_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.mutes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mutes_id_seq OWNER TO pinafore;

--
-- Name: mutes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.mutes_id_seq OWNED BY public.mutes.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.notifications (
    id bigint NOT NULL,
    activity_id bigint NOT NULL,
    activity_type character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    account_id bigint NOT NULL,
    from_account_id bigint NOT NULL
);


ALTER TABLE public.notifications OWNER TO pinafore;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notifications_id_seq OWNER TO pinafore;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: oauth_access_grants; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.oauth_access_grants (
    id bigint NOT NULL,
    token character varying NOT NULL,
    expires_in integer NOT NULL,
    redirect_uri text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    revoked_at timestamp without time zone,
    scopes character varying,
    application_id bigint NOT NULL,
    resource_owner_id bigint NOT NULL
);


ALTER TABLE public.oauth_access_grants OWNER TO pinafore;

--
-- Name: oauth_access_grants_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.oauth_access_grants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.oauth_access_grants_id_seq OWNER TO pinafore;

--
-- Name: oauth_access_grants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.oauth_access_grants_id_seq OWNED BY public.oauth_access_grants.id;


--
-- Name: oauth_access_tokens; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.oauth_access_tokens (
    id bigint NOT NULL,
    token character varying NOT NULL,
    refresh_token character varying,
    expires_in integer,
    revoked_at timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    scopes character varying,
    application_id bigint,
    resource_owner_id bigint
);


ALTER TABLE public.oauth_access_tokens OWNER TO pinafore;

--
-- Name: oauth_access_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.oauth_access_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.oauth_access_tokens_id_seq OWNER TO pinafore;

--
-- Name: oauth_access_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.oauth_access_tokens_id_seq OWNED BY public.oauth_access_tokens.id;


--
-- Name: oauth_applications; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.oauth_applications (
    id bigint NOT NULL,
    name character varying NOT NULL,
    uid character varying NOT NULL,
    secret character varying NOT NULL,
    redirect_uri text NOT NULL,
    scopes character varying DEFAULT ''::character varying NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    superapp boolean DEFAULT false NOT NULL,
    website character varying,
    owner_type character varying,
    owner_id bigint,
    confidential boolean DEFAULT true NOT NULL
);


ALTER TABLE public.oauth_applications OWNER TO pinafore;

--
-- Name: oauth_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.oauth_applications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.oauth_applications_id_seq OWNER TO pinafore;

--
-- Name: oauth_applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.oauth_applications_id_seq OWNED BY public.oauth_applications.id;


--
-- Name: pghero_space_stats; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.pghero_space_stats (
    id bigint NOT NULL,
    database text,
    schema text,
    relation text,
    size bigint,
    captured_at timestamp without time zone
);


ALTER TABLE public.pghero_space_stats OWNER TO pinafore;

--
-- Name: pghero_space_stats_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.pghero_space_stats_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pghero_space_stats_id_seq OWNER TO pinafore;

--
-- Name: pghero_space_stats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.pghero_space_stats_id_seq OWNED BY public.pghero_space_stats.id;


--
-- Name: preview_cards; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.preview_cards (
    id bigint NOT NULL,
    url character varying DEFAULT ''::character varying NOT NULL,
    title character varying DEFAULT ''::character varying NOT NULL,
    description character varying DEFAULT ''::character varying NOT NULL,
    image_file_name character varying,
    image_content_type character varying,
    image_file_size integer,
    image_updated_at timestamp without time zone,
    type integer DEFAULT 0 NOT NULL,
    html text DEFAULT ''::text NOT NULL,
    author_name character varying DEFAULT ''::character varying NOT NULL,
    author_url character varying DEFAULT ''::character varying NOT NULL,
    provider_name character varying DEFAULT ''::character varying NOT NULL,
    provider_url character varying DEFAULT ''::character varying NOT NULL,
    width integer DEFAULT 0 NOT NULL,
    height integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    embed_url character varying DEFAULT ''::character varying NOT NULL
);


ALTER TABLE public.preview_cards OWNER TO pinafore;

--
-- Name: preview_cards_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.preview_cards_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.preview_cards_id_seq OWNER TO pinafore;

--
-- Name: preview_cards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.preview_cards_id_seq OWNED BY public.preview_cards.id;


--
-- Name: preview_cards_statuses; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.preview_cards_statuses (
    preview_card_id bigint NOT NULL,
    status_id bigint NOT NULL
);


ALTER TABLE public.preview_cards_statuses OWNER TO pinafore;

--
-- Name: relays; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.relays (
    id bigint NOT NULL,
    inbox_url character varying DEFAULT ''::character varying NOT NULL,
    follow_activity_id character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    state integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.relays OWNER TO pinafore;

--
-- Name: relays_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.relays_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.relays_id_seq OWNER TO pinafore;

--
-- Name: relays_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.relays_id_seq OWNED BY public.relays.id;


--
-- Name: report_notes; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.report_notes (
    id bigint NOT NULL,
    content text NOT NULL,
    report_id bigint NOT NULL,
    account_id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.report_notes OWNER TO pinafore;

--
-- Name: report_notes_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.report_notes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.report_notes_id_seq OWNER TO pinafore;

--
-- Name: report_notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.report_notes_id_seq OWNED BY public.report_notes.id;


--
-- Name: reports; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.reports (
    id bigint NOT NULL,
    status_ids bigint[] DEFAULT '{}'::bigint[] NOT NULL,
    comment text DEFAULT ''::text NOT NULL,
    action_taken boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    account_id bigint NOT NULL,
    action_taken_by_account_id bigint,
    target_account_id bigint NOT NULL,
    assigned_account_id bigint
);


ALTER TABLE public.reports OWNER TO pinafore;

--
-- Name: reports_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.reports_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reports_id_seq OWNER TO pinafore;

--
-- Name: reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.reports_id_seq OWNED BY public.reports.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


ALTER TABLE public.schema_migrations OWNER TO pinafore;

--
-- Name: session_activations; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.session_activations (
    id bigint NOT NULL,
    session_id character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    user_agent character varying DEFAULT ''::character varying NOT NULL,
    ip inet,
    access_token_id bigint,
    user_id bigint NOT NULL,
    web_push_subscription_id bigint
);


ALTER TABLE public.session_activations OWNER TO pinafore;

--
-- Name: session_activations_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.session_activations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.session_activations_id_seq OWNER TO pinafore;

--
-- Name: session_activations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.session_activations_id_seq OWNED BY public.session_activations.id;


--
-- Name: settings; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.settings (
    id bigint NOT NULL,
    var character varying NOT NULL,
    value text,
    thing_type character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    thing_id bigint
);


ALTER TABLE public.settings OWNER TO pinafore;

--
-- Name: settings_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.settings_id_seq OWNER TO pinafore;

--
-- Name: settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;


--
-- Name: site_uploads; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.site_uploads (
    id bigint NOT NULL,
    var character varying DEFAULT ''::character varying NOT NULL,
    file_file_name character varying,
    file_content_type character varying,
    file_file_size integer,
    file_updated_at timestamp without time zone,
    meta json,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.site_uploads OWNER TO pinafore;

--
-- Name: site_uploads_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.site_uploads_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.site_uploads_id_seq OWNER TO pinafore;

--
-- Name: site_uploads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.site_uploads_id_seq OWNED BY public.site_uploads.id;


--
-- Name: status_pins; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.status_pins (
    id bigint NOT NULL,
    account_id bigint NOT NULL,
    status_id bigint NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.status_pins OWNER TO pinafore;

--
-- Name: status_pins_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.status_pins_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.status_pins_id_seq OWNER TO pinafore;

--
-- Name: status_pins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.status_pins_id_seq OWNED BY public.status_pins.id;


--
-- Name: status_stats; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.status_stats (
    id bigint NOT NULL,
    status_id bigint NOT NULL,
    replies_count bigint DEFAULT 0 NOT NULL,
    reblogs_count bigint DEFAULT 0 NOT NULL,
    favourites_count bigint DEFAULT 0 NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.status_stats OWNER TO pinafore;

--
-- Name: status_stats_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.status_stats_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.status_stats_id_seq OWNER TO pinafore;

--
-- Name: status_stats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.status_stats_id_seq OWNED BY public.status_stats.id;


--
-- Name: statuses; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.statuses (
    id bigint DEFAULT public.timestamp_id('statuses'::text) NOT NULL,
    uri character varying,
    text text DEFAULT ''::text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    in_reply_to_id bigint,
    reblog_of_id bigint,
    url character varying,
    sensitive boolean DEFAULT false NOT NULL,
    visibility integer DEFAULT 0 NOT NULL,
    spoiler_text text DEFAULT ''::text NOT NULL,
    reply boolean DEFAULT false NOT NULL,
    language character varying,
    conversation_id bigint,
    local boolean,
    account_id bigint NOT NULL,
    application_id bigint,
    in_reply_to_account_id bigint
);


ALTER TABLE public.statuses OWNER TO pinafore;

--
-- Name: statuses_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.statuses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.statuses_id_seq OWNER TO pinafore;

--
-- Name: statuses_tags; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.statuses_tags (
    status_id bigint NOT NULL,
    tag_id bigint NOT NULL
);


ALTER TABLE public.statuses_tags OWNER TO pinafore;

--
-- Name: stream_entries; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.stream_entries (
    id bigint NOT NULL,
    activity_id bigint,
    activity_type character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    hidden boolean DEFAULT false NOT NULL,
    account_id bigint
);


ALTER TABLE public.stream_entries OWNER TO pinafore;

--
-- Name: stream_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.stream_entries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stream_entries_id_seq OWNER TO pinafore;

--
-- Name: stream_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.stream_entries_id_seq OWNED BY public.stream_entries.id;


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.subscriptions (
    id bigint NOT NULL,
    callback_url character varying DEFAULT ''::character varying NOT NULL,
    secret character varying,
    expires_at timestamp without time zone,
    confirmed boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    last_successful_delivery_at timestamp without time zone,
    domain character varying,
    account_id bigint NOT NULL
);


ALTER TABLE public.subscriptions OWNER TO pinafore;

--
-- Name: subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.subscriptions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.subscriptions_id_seq OWNER TO pinafore;

--
-- Name: subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.subscriptions_id_seq OWNED BY public.subscriptions.id;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.tags (
    id bigint NOT NULL,
    name character varying DEFAULT ''::character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.tags OWNER TO pinafore;

--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tags_id_seq OWNER TO pinafore;

--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    email character varying DEFAULT ''::character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    encrypted_password character varying DEFAULT ''::character varying NOT NULL,
    reset_password_token character varying,
    reset_password_sent_at timestamp without time zone,
    remember_created_at timestamp without time zone,
    sign_in_count integer DEFAULT 0 NOT NULL,
    current_sign_in_at timestamp without time zone,
    last_sign_in_at timestamp without time zone,
    current_sign_in_ip inet,
    last_sign_in_ip inet,
    admin boolean DEFAULT false NOT NULL,
    confirmation_token character varying,
    confirmed_at timestamp without time zone,
    confirmation_sent_at timestamp without time zone,
    unconfirmed_email character varying,
    locale character varying,
    encrypted_otp_secret character varying,
    encrypted_otp_secret_iv character varying,
    encrypted_otp_secret_salt character varying,
    consumed_timestep integer,
    otp_required_for_login boolean DEFAULT false NOT NULL,
    last_emailed_at timestamp without time zone,
    otp_backup_codes character varying[],
    filtered_languages character varying[] DEFAULT '{}'::character varying[] NOT NULL,
    account_id bigint NOT NULL,
    disabled boolean DEFAULT false NOT NULL,
    moderator boolean DEFAULT false NOT NULL,
    invite_id bigint,
    remember_token character varying,
    chosen_languages character varying[]
);


ALTER TABLE public.users OWNER TO pinafore;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO pinafore;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: web_push_subscriptions; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.web_push_subscriptions (
    id bigint NOT NULL,
    endpoint character varying NOT NULL,
    key_p256dh character varying NOT NULL,
    key_auth character varying NOT NULL,
    data json,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    access_token_id bigint,
    user_id bigint
);


ALTER TABLE public.web_push_subscriptions OWNER TO pinafore;

--
-- Name: web_push_subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.web_push_subscriptions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.web_push_subscriptions_id_seq OWNER TO pinafore;

--
-- Name: web_push_subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.web_push_subscriptions_id_seq OWNED BY public.web_push_subscriptions.id;


--
-- Name: web_settings; Type: TABLE; Schema: public; Owner: pinafore
--

CREATE TABLE public.web_settings (
    id bigint NOT NULL,
    data json,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.web_settings OWNER TO pinafore;

--
-- Name: web_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: pinafore
--

CREATE SEQUENCE public.web_settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.web_settings_id_seq OWNER TO pinafore;

--
-- Name: web_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pinafore
--

ALTER SEQUENCE public.web_settings_id_seq OWNED BY public.web_settings.id;


--
-- Name: account_conversations id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.account_conversations ALTER COLUMN id SET DEFAULT nextval('public.account_conversations_id_seq'::regclass);


--
-- Name: account_domain_blocks id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.account_domain_blocks ALTER COLUMN id SET DEFAULT nextval('public.account_domain_blocks_id_seq'::regclass);


--
-- Name: account_moderation_notes id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.account_moderation_notes ALTER COLUMN id SET DEFAULT nextval('public.account_moderation_notes_id_seq'::regclass);


--
-- Name: account_pins id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.account_pins ALTER COLUMN id SET DEFAULT nextval('public.account_pins_id_seq'::regclass);


--
-- Name: accounts id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.accounts ALTER COLUMN id SET DEFAULT nextval('public.accounts_id_seq'::regclass);


--
-- Name: admin_action_logs id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.admin_action_logs ALTER COLUMN id SET DEFAULT nextval('public.admin_action_logs_id_seq'::regclass);


--
-- Name: backups id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.backups ALTER COLUMN id SET DEFAULT nextval('public.backups_id_seq'::regclass);


--
-- Name: blocks id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.blocks ALTER COLUMN id SET DEFAULT nextval('public.blocks_id_seq'::regclass);


--
-- Name: conversation_mutes id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.conversation_mutes ALTER COLUMN id SET DEFAULT nextval('public.conversation_mutes_id_seq'::regclass);


--
-- Name: conversations id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.conversations ALTER COLUMN id SET DEFAULT nextval('public.conversations_id_seq'::regclass);


--
-- Name: custom_emojis id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.custom_emojis ALTER COLUMN id SET DEFAULT nextval('public.custom_emojis_id_seq'::regclass);


--
-- Name: custom_filters id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.custom_filters ALTER COLUMN id SET DEFAULT nextval('public.custom_filters_id_seq'::regclass);


--
-- Name: domain_blocks id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.domain_blocks ALTER COLUMN id SET DEFAULT nextval('public.domain_blocks_id_seq'::regclass);


--
-- Name: email_domain_blocks id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.email_domain_blocks ALTER COLUMN id SET DEFAULT nextval('public.email_domain_blocks_id_seq'::regclass);


--
-- Name: favourites id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.favourites ALTER COLUMN id SET DEFAULT nextval('public.favourites_id_seq'::regclass);


--
-- Name: follow_requests id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.follow_requests ALTER COLUMN id SET DEFAULT nextval('public.follow_requests_id_seq'::regclass);


--
-- Name: follows id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.follows ALTER COLUMN id SET DEFAULT nextval('public.follows_id_seq'::regclass);


--
-- Name: identities id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.identities ALTER COLUMN id SET DEFAULT nextval('public.identities_id_seq'::regclass);


--
-- Name: imports id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.imports ALTER COLUMN id SET DEFAULT nextval('public.imports_id_seq'::regclass);


--
-- Name: invites id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.invites ALTER COLUMN id SET DEFAULT nextval('public.invites_id_seq'::regclass);


--
-- Name: list_accounts id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.list_accounts ALTER COLUMN id SET DEFAULT nextval('public.list_accounts_id_seq'::regclass);


--
-- Name: lists id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.lists ALTER COLUMN id SET DEFAULT nextval('public.lists_id_seq'::regclass);


--
-- Name: media_attachments id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.media_attachments ALTER COLUMN id SET DEFAULT nextval('public.media_attachments_id_seq'::regclass);


--
-- Name: mentions id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.mentions ALTER COLUMN id SET DEFAULT nextval('public.mentions_id_seq'::regclass);


--
-- Name: mutes id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.mutes ALTER COLUMN id SET DEFAULT nextval('public.mutes_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: oauth_access_grants id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.oauth_access_grants ALTER COLUMN id SET DEFAULT nextval('public.oauth_access_grants_id_seq'::regclass);


--
-- Name: oauth_access_tokens id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.oauth_access_tokens ALTER COLUMN id SET DEFAULT nextval('public.oauth_access_tokens_id_seq'::regclass);


--
-- Name: oauth_applications id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.oauth_applications ALTER COLUMN id SET DEFAULT nextval('public.oauth_applications_id_seq'::regclass);


--
-- Name: pghero_space_stats id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.pghero_space_stats ALTER COLUMN id SET DEFAULT nextval('public.pghero_space_stats_id_seq'::regclass);


--
-- Name: preview_cards id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.preview_cards ALTER COLUMN id SET DEFAULT nextval('public.preview_cards_id_seq'::regclass);


--
-- Name: relays id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.relays ALTER COLUMN id SET DEFAULT nextval('public.relays_id_seq'::regclass);


--
-- Name: report_notes id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.report_notes ALTER COLUMN id SET DEFAULT nextval('public.report_notes_id_seq'::regclass);


--
-- Name: reports id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.reports ALTER COLUMN id SET DEFAULT nextval('public.reports_id_seq'::regclass);


--
-- Name: session_activations id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.session_activations ALTER COLUMN id SET DEFAULT nextval('public.session_activations_id_seq'::regclass);


--
-- Name: settings id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);


--
-- Name: site_uploads id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.site_uploads ALTER COLUMN id SET DEFAULT nextval('public.site_uploads_id_seq'::regclass);


--
-- Name: status_pins id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.status_pins ALTER COLUMN id SET DEFAULT nextval('public.status_pins_id_seq'::regclass);


--
-- Name: status_stats id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.status_stats ALTER COLUMN id SET DEFAULT nextval('public.status_stats_id_seq'::regclass);


--
-- Name: stream_entries id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.stream_entries ALTER COLUMN id SET DEFAULT nextval('public.stream_entries_id_seq'::regclass);


--
-- Name: subscriptions id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.subscriptions ALTER COLUMN id SET DEFAULT nextval('public.subscriptions_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: web_push_subscriptions id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.web_push_subscriptions ALTER COLUMN id SET DEFAULT nextval('public.web_push_subscriptions_id_seq'::regclass);


--
-- Name: web_settings id; Type: DEFAULT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.web_settings ALTER COLUMN id SET DEFAULT nextval('public.web_settings_id_seq'::regclass);


--
-- Data for Name: account_conversations; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.account_conversations (id, account_id, conversation_id, participant_account_ids, status_ids, last_status_id, lock_version, unread) FROM stdin;
\.


--
-- Data for Name: account_domain_blocks; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.account_domain_blocks (id, domain, created_at, updated_at, account_id) FROM stdin;
\.


--
-- Data for Name: account_moderation_notes; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.account_moderation_notes (id, content, account_id, target_account_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: account_pins; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.account_pins (id, account_id, target_account_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.accounts (id, username, domain, secret, private_key, public_key, remote_url, salmon_url, hub_url, created_at, updated_at, note, display_name, uri, url, avatar_file_name, avatar_content_type, avatar_file_size, avatar_updated_at, header_file_name, header_content_type, header_file_size, header_updated_at, avatar_remote_url, subscription_expires_at, silenced, suspended, locked, header_remote_url, statuses_count, followers_count, following_count, last_webfingered_at, inbox_url, outbox_url, shared_inbox_url, followers_url, protocol, memorial, moved_to_account_id, featured_collection_url, fields, actor_type) FROM stdin;
2	foobar	\N		-----BEGIN RSA PRIVATE KEY-----\nMIIEogIBAAKCAQEAoMmpjeV32Muoe7G9jtM1juQgFIWb+LVYb3Q+wDvcGui2u8ow\nlsffsZl3f0RBIQXAfqkmB0j55ISg2Rlp+IOEcDxz32N9syfd+6I03PUfshtb5xPP\n7kDsrlWDbD/fI5SpepaIYAsRH6bpZDlS3BCwRTgWX3FEVogOTYNXGBBL95vZn4U4\nksxo8QH8gKWaH9itYUOovvsbxARGKTU4Besvi2HzP2839Va4ce4SF5gaVLNH3Lxz\nnQU6qZk19kGN2+3k2Y80flmtSORLtjBywwZ6B2H3IJaKdVacnX9BZix1Uv9z0lib\nrJwF0/laDqNZvUDUjJfGoOq0Mn1VxXB1qgJ2RwIDAQABAoIBAEzMZe8/xoHHrP8A\nA6GfonpQ3j3PH5Oo0sfRh1N8hAJaW0XRKmoqp98FhX1FVbJ3M92L330lTy7mZomr\nyOEJuI1/Yn014UlcZnwVmxhbALuqs7foz61mV2Zhs/dVfrhY/qZuFk+Bmbk7mUjk\n1H4GfpthUdZenJyUOfiuHkCBMDfg+ColWRPKohopvEPYpj3AT0KdeZt8y+ElYBgF\nkPlEr/NwzxoqPyyt007x2/mouqsDu23M11/WLJbYUKd8m8NXZMLrSqjcUjxkIkjV\nOCXbXJM7MULCAgX85H6ymf/xBnevwMtdXkP3pUjvVEBdROUPHpVh4bEjikAN4hvP\nZL2HwbECgYEA0MDcvkvIjVlRmHSappw1i6QF+3bBdiE9yRQLl3+g3a69VkAYPuOc\nF/tWBc/W+ZvdNY53cJms4EbiVO5zmJE87c1DlfG7d911DiI6lgTdlLdpbpdR49uH\n/yiZc1WbX4f+gBdyqFMrHJwC+ymk4CL7Ma5yoWELY4OxaC74Qr/HRBkCgYEAxS2t\n35ZBXco/X6zXhKw4hYeFXVMqCkbAwPdQsarTJXIG1hsC/SrHU9o38oobIjZoex7X\npwMBXfN8Aj5VipV8ttB/GI68fdKwRpL9wzOu+QAfGO3++ZN+h+cFzvW51VoHe4K2\nkcxDQjVQ2hvVE0AqTsz3m+wTyoHuJvfRYHvv2V8CgYA7fCmq5Edy19fjfJ6xCWRM\ntWGrBW0db11+1gJzmj/Jy8hSMpN2ID/TqaAaqd4VZK/FWiJ46KGViz1lfEleWUym\nas5uhOKpxmZbr69IHnzRqu4VQHNqXZ1EPVp0vhk3QLZp48SdaI2pal+DGJvN7snr\nn0005UVshxNfn7rIsoNiyQKBgECaFr2KnR/9g4X1Oydcxaf6HtfUx5FWXRDb9rQ/\nI67BDTxY3UHVIjl25Z2xYfJzoQe1szIk6e2+OIMDqUMedx3ucbW6DkerH9X/kuTB\nqjIquAWS9FcQ3APqzRxhpeEg/hKZYPej1OV8UmEjfUwxWas3vGh5kIJoz34084SJ\nFqxBAoGADPTjFA6dqZBxY8tO63/blR0+CgE+Z/BbsPxmtGKgAyQbnM2TQ7IqCzQw\nJxDF6p3bQqyZYVLfrQ0BLna2I0AFPVGn7fUNAAOT67HVtm3U58Cbdt457O51EQuW\nFSiCX7BuMU5uJT2S70fWSMFf3iwczxJiQwwOwBLIDjpkSanm9eM=\n-----END RSA PRIVATE KEY-----\n	-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoMmpjeV32Muoe7G9jtM1\njuQgFIWb+LVYb3Q+wDvcGui2u8owlsffsZl3f0RBIQXAfqkmB0j55ISg2Rlp+IOE\ncDxz32N9syfd+6I03PUfshtb5xPP7kDsrlWDbD/fI5SpepaIYAsRH6bpZDlS3BCw\nRTgWX3FEVogOTYNXGBBL95vZn4U4ksxo8QH8gKWaH9itYUOovvsbxARGKTU4Besv\ni2HzP2839Va4ce4SF5gaVLNH3LxznQU6qZk19kGN2+3k2Y80flmtSORLtjBywwZ6\nB2H3IJaKdVacnX9BZix1Uv9z0librJwF0/laDqNZvUDUjJfGoOq0Mn1VxXB1qgJ2\nRwIDAQAB\n-----END PUBLIC KEY-----\n				2018-03-06 03:52:20.992567	2018-03-06 03:52:20.992567				\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f		0	0	1	\N					0	f	\N	\N	\N	\N
3	quux	\N		-----BEGIN RSA PRIVATE KEY-----\nMIIEpQIBAAKCAQEAuXdx5P91Cn1Sx+C4ihnk2r2L+q6Lalr/r9h9hQVRQaR5ZiHF\nj61eST6y0k0KzZ3ALcpjZHZsjbbn/LGFjyBwTqqLhYcImjeiCTt2J69o+imI9x8p\n3A1tIWwMn3oQVvT5mXqj1cEDzqmgpByPA0xF9YAbKwGu/3H+DLOckauI7AeOcgrt\nfydFX7gsyv4kji/tfzg9D+8PwYXLKHIkjuCadxR4h58m2J+KZnOcCDK0x0tVhq1m\n6gEX+5wMRrWEvC3tSUNFH+58q3ozNuNuhyEURCcr4jQa77ZWiNxjR6JmFWl5YKfZ\n8Y+hNtRjF4VT+aW2T7UanEIxrabRvKL2aC26/wIDAQABAoIBAQCTI0DXdRdMqBo5\nen3NCjf2lbPsv/bY/LKmtjD2jD5nvm2VaiuLDfakUzqY/wgYEhO6ADuUIyOB1l77\nqXaVEx4mOsUPvQ5FEufZPTRCzbWR6cvAiheyfXBbuJXXG4bFBfrTGWnLFiLIHOjV\n6dZHvoYt+2ESYHaOL8hmGUSYiKbK4OYB8KzVLikm4DG2+Ck6JxaCNbkI3VxOBGD9\nypRWLIBefVPwntxCU8Kb8k5JJAJOMUkucZ7Mjj7TRzyq133kupq7oaOE0V4/o63U\nQVomtGfw1Q7HVuVsXm9dClIG8tRhDGfAO8QgqmHv4GfNt7IpaKHiBkp0e1R02LMK\nc4WeElgBAoGBAN5EaDXDmcyQ+4CBbNNGDG8h970W1ElvS9G6xTZkQ4KrnWZmKNw7\nzfA4TjvX88cUYbw1h0/YBO4bUe08N5bJihmLAxPBPpwkxhkzgisjBIIw5IEIM7Vo\nVmz+u8iCuEH2Uh89X354nxE5UWPm+jS7zN5Z3QGI7PFeksisNlGPbXQBAoGBANWd\nP55kDswWZ77UUbn4A1kiaD48/b0SkuvxA3HaZFbZJlHCrRfgn5yiO8IGoQCV2YQg\nZRfVIyDQWeCjGjmdYMX661OXsJDoxmGTPamgl5KB4dB92bZB09kTwJsoJz47jnGO\nkYHt+/zMeXiRrTCi+07vMPlZGnyW4WFqPZATTy7/AoGAUr7IxOsywJNg7fBA4U58\nporQvdZX5ZbHdSbA8ITXFThqeoqhv4uMGVf82A6HNKAD2pta6oCTJUmKcHUwhLQ2\n81drJ9mTQ3H1RcCFPyXkMcud5eN1zJ0xP5Z9tiHkErpuzC5+9IhXP4RFJpoAn80i\nccymmEGvZBQ/NPHXrvlkWAECgYEAy1ZUKMG2FC9/sfcJlKyxAzftYtFL956mnFFf\nphDtUn6CK3HUstXvGXqUx6zntVbvJwZvNLB+L84kv+CCJjXY2JxxRbEvMcFilZ9D\nIyTrI1rfSUeC5irjLc/Pl+Iw+NxYS2AawkN3irxZJJwG8DU0Y37sb26R9+bnw4MN\n9wdqaKECgYEAnLWO4wrhg7keBAVF6HFgRyjT5S6DHFM2BsEpjbqrxLN7M0pVimJa\nYxVJj70Clm3OdkZ8k8f9AaxNK4l38cTRNct+IhKlQB4Ryz+Gpc+T0HOAv9kk6qJ4\niJofJ1scmvubau+vOmtI6mfuyIsiSVZdW9jOEihkyzlLa2K5K5m1yww=\n-----END RSA PRIVATE KEY-----\n	-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuXdx5P91Cn1Sx+C4ihnk\n2r2L+q6Lalr/r9h9hQVRQaR5ZiHFj61eST6y0k0KzZ3ALcpjZHZsjbbn/LGFjyBw\nTqqLhYcImjeiCTt2J69o+imI9x8p3A1tIWwMn3oQVvT5mXqj1cEDzqmgpByPA0xF\n9YAbKwGu/3H+DLOckauI7AeOcgrtfydFX7gsyv4kji/tfzg9D+8PwYXLKHIkjuCa\ndxR4h58m2J+KZnOcCDK0x0tVhq1m6gEX+5wMRrWEvC3tSUNFH+58q3ozNuNuhyEU\nRCcr4jQa77ZWiNxjR6JmFWl5YKfZ8Y+hNtRjF4VT+aW2T7UanEIxrabRvKL2aC26\n/wIDAQAB\n-----END PUBLIC KEY-----\n				2018-03-06 03:52:52.495982	2018-03-06 03:52:52.495982				\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f		0	0	1	\N					0	f	\N	\N	\N	\N
4	ExternalLinks	\N		-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEArvTBpSQFmhlygPYMF0YTi5/Cd5mmKYlfu/nqR1bGUixefGWR\nV89Z2YcEV7qhOtYQFjO3kkgn8e0S3O/d52PpcKAm7L3RxHNXG2KuOgW0UkG2wqQY\nV/fx3Fj8xvCISOc1ZEbrem9pt9/XtNsBozL13lYloKGNC5FGN6W0kwd25EE1oq9p\nhO8Z+Wwh4hx1Qpg30FEW3OpVDGxEq96p4mR50cPfSGXMAeyYg93njC1kfSdnaNuq\n/8ouMS1IzJlzr4N+CweCB+qKLbB7+05bpO3SC7Xnf0r1e+N2zFdzo1iuePv6tqkQ\nzM7ppTU7eWGuTUozQrb7ROI59ML1eKcAuFcYQwIDAQABAoIBAQCCZe5GdViviDPt\npnVQi2xZ7pL0rVJJNxhhdF2HGkfqSyOJN/JiLitbk+RKttEglxeaVKWHo7wR9o7O\nmQEdSzxcMyGP5dKIxyavRJdyq3nArTXYUJHMTwK3JqQQaopJO/pxaOJteMikwXN2\nWp0X1A2ozzBwTrhfXMGnDBxQUYntiOi/Hi+E4ZCBEoAhWFZSq4YH4hB5HOKUHUIZ\niKfKsFV8H5TqR0li6FbIZtR+fBY83FcRPsOA423wswrgTXPPZ3Mnv0rMtg3BijpB\nl88B5uLMprpckwLzRLRZO6KCACxjoKrrFIXy4apRG1jcIjd4Nr4j3Lus+pPNQRI3\nKsWxRpvRAoGBAOA05cfazBFhUQaRRxCmxc+mM30gAmd5IL4fGS+4DKtZz6DBr0ke\nfOS3wZ6ANo5Ovg9Js3fN9U09sRO5f4+QLeaE2f/EzdlkocnKqJGgWpNLsPAv/BrK\ngCBS3b7vXPTkiXQcuct+0dgP5tlCU+BRmH1yMTjKjaB+25mpOFZhsHJHAoGBAMfD\n+cAsAI/OwNyNAgF8gLJWdCMuYvoYlYGBAbhpFk3Xrg1FvAQbyeFDleGlaqBszq8P\nmk1hXLhX7aUZLc5g3wcmfGdFbJIjbBHxfmJqgy7iA8a60FxlD3wCtx7txD33tKSU\nt7NeMhR44YdwZ8XmPI/4vK/34bFJb1KLAvg4CswlAoGARjiLFzMx4uel5vatWUvC\nfKzDR5c06Y+Ib8Nxsf5lCW3Rl7nR2obP+xqKa8ggTiXfZQ5iRU2eXJjL0y+wAhjY\nJ3DIjlDnYAUinv74GNQuSh/UxQViYkm2I2mQxfJWHOVPH6y3jEKmGpOwa69YcdNc\nfT28qNrXzMKuqMvVN0jVaJUCgYBWpjgP1kZMGodnYzaKhIGiWYO4uuctyjoXWWjw\nn4yQKUyS7zuVoKQZtOIvZTvx6CBiqObqR6AbSfCH23sV+Mjk5hmyBdgJL5ox0kla\n0Q6j6F9w9Rlp6mAkD1106fdkVayicuuXvvUEEkbpI6WvnqWIYYEe5uubpdnGuQuJ\ntW1hjQKBgQC2CjJ35lntsCHoWud8uWnlMjtXAbEWSLkcTUXvY6TaMtHCMVvpUvCI\niacqlUVkVTS7uHNN9jre/z0+iEWM+jpByC303/NCWtvnmjHT7uJHrFNqmdfeuKGs\n4WTB0rMNvaLv7ikHyi9WGCpeD+q2pmxIdFNKCepeuuiBuygCOoFG0A==\n-----END RSA PRIVATE KEY-----\n	-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArvTBpSQFmhlygPYMF0YT\ni5/Cd5mmKYlfu/nqR1bGUixefGWRV89Z2YcEV7qhOtYQFjO3kkgn8e0S3O/d52Pp\ncKAm7L3RxHNXG2KuOgW0UkG2wqQYV/fx3Fj8xvCISOc1ZEbrem9pt9/XtNsBozL1\n3lYloKGNC5FGN6W0kwd25EE1oq9phO8Z+Wwh4hx1Qpg30FEW3OpVDGxEq96p4mR5\n0cPfSGXMAeyYg93njC1kfSdnaNuq/8ouMS1IzJlzr4N+CweCB+qKLbB7+05bpO3S\nC7Xnf0r1e+N2zFdzo1iuePv6tqkQzM7ppTU7eWGuTUozQrb7ROI59ML1eKcAuFcY\nQwIDAQAB\n-----END PUBLIC KEY-----\n				2018-03-06 03:53:52.5107	2018-03-06 03:54:25.492347	Check out https://joinmastodon.org and #cat and #mastocats and also @quux is my friend	External Lonk		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f		0	0	1	\N					0	f	\N	\N	\N	\N
5	baz	\N		-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA6MoozQ6aD0mGLXjepbLjRVITMiV/V6+Gv3hWBshGckO41bTn\nGLJ3vP/Qi93GCig78LHKbYtYyZ0hW5n7oLcX+ficX5KM/cmwhxzH0nnwzxPr/Upl\nbHcN+GTTGHOrqAs/PQpfcnraIGROh1KSMxvTJmBIcaUr50aqfvdV2TGD+NGW+rYS\noK8Txja2Yr4cEfZZydFZxVhePzlrwwwSVEZm1u310KIWaIRhetAtSCkIkdUa3/8U\n6gfObp/eZbdugFLjC9dOnbyuJWX7j587nZyF1tfEGD5Wchybb3ZNK3742HpR0E8m\n7wQQl5onxG7bJD25zxgb0E03G6kxv6o43ZnXFQIDAQABAoIBAQDQDL1iZwZxWzi8\nMyZp2PMd5TiavMCO0aUQQrA/54ZuYPA0rzVK8VXqaIcuOcrhEQxhFcThGoUDy5cg\nkwI8pOac1gCLuiKgPz2xw5sjFTCPIjLrcS4sPksSEKpJVDe6PDMMjtS3L+z6visg\n7j8Txm50AeE9EG2oiZOfXdYwAvz7xkFLV8sUHI+Au37x61ulm0MMYrafCVkwIYIm\n3m8OPGLAFtN9nOJUdq7mExHu+A27s/3ypIae6GDu7zNyJW2TyiGpnw4UUgJQJhgy\nOP8keFcMyaMiPKyALKtjmHdFlebDyfH8btfpXiXErzRvH326JixJtg4M1xRWBra1\nl1NOUIaRAoGBAPgZUG9fWdPGTcUKsa1CJjSK0gwVldqeuxxh2Vkcai18XEXzTZ/z\ndVM/XDymUqOtIegjt52SNR2iF1ViomF5ur+74/xo1tXNf8vjMzeXJ7R0Nz5kd+ZN\nCWtVexeXvxtQO7lbJJwecjI+aLUv+9yWeZHIvSS+tHvC7zMa1DjKJIu3AoGBAPA0\nCIOTral3q9MOwDOBjCtvv72RjLx5cU93J2dca0xxYI/wa2IDl18WMEOhovB1knId\nzf2PhwakbWQ9axoq303L5muPMiVT9rkxBf90r/bUEdQPfZNRAQZ01v1uWUZnZCz7\nFJmRuk9YNbnYzp4ljU1iz7dL5YvA8gYSnma1yUuTAoGATNkqfRT/8gUe2cXyO0Se\nKPBHF88n18wLEUON23hduzEmM9SlWsJCuUKLA45RUrmyIwHNQlWjdkZbC+u9eIwI\nOJOujuS6hwdcan85wiJj/hVxdzYPnZqHLGQR+MDcRU2Y8lU1Bda4cK+8J0NxtGY3\nydxwGg2oQh2jkiThT6XtpAkCgYEAu5u4ZqRKiEla387umYv+YdK3TKXI6VBlCu8C\nzL0nZR5MkD/0bypk6TSYX8p4TB1YU18qC3g1ux9j/V3nMBn6LXYrMyk1vmf1FTHQ\nAHUwFrYOcrXim9Qx28wYOvscKVwJpwQ4U7W5cc1wsQZAYs7rrVyW5hAWanA52Dpk\nk846OZcCgYB4G8BOm7apwEfkjVzmPMazxZsV2COB2r32Wdbiuulu0hbtTVO0rZgw\nRJGCow3wEWHoO1hzVO0aFVsLB176NaRDKnEP/L2xn2y71cS3mo+FRIEHOwL9sBOL\n958bpX5AWw7KOMCPOcesFEffomMl8raaMcYkUabEABMjgNJHzL4ICA==\n-----END RSA PRIVATE KEY-----\n	-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6MoozQ6aD0mGLXjepbLj\nRVITMiV/V6+Gv3hWBshGckO41bTnGLJ3vP/Qi93GCig78LHKbYtYyZ0hW5n7oLcX\n+ficX5KM/cmwhxzH0nnwzxPr/UplbHcN+GTTGHOrqAs/PQpfcnraIGROh1KSMxvT\nJmBIcaUr50aqfvdV2TGD+NGW+rYSoK8Txja2Yr4cEfZZydFZxVhePzlrwwwSVEZm\n1u310KIWaIRhetAtSCkIkdUa3/8U6gfObp/eZbdugFLjC9dOnbyuJWX7j587nZyF\n1tfEGD5Wchybb3ZNK3742HpR0E8m7wQQl5onxG7bJD25zxgb0E03G6kxv6o43ZnX\nFQIDAQAB\n-----END PUBLIC KEY-----\n				2018-03-08 17:13:19.723561	2018-03-08 17:13:19.723561				\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f		0	0	1	\N					0	f	\N	\N	\N	\N
1	admin	\N		-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAqhTaq3zCpRnFoQzHheYBfwcdjjczJ4pSKwsq1qJmydctdZM6\ngScZfgObg0mY7Y1UrnlQDw5RB6Py8hFmGGEh/wJm8mqxx473L+noX8X49jhFuv5O\nsnWTDLMbo497hCaZoD5/7y/zlfgYzGp2Llt8GKmX9Cg8W1G52dZlNq/HbEygg0W7\nvq2LBPJvuTAE0RH2jxKU+JCsVhfaUzEFUlcrJyXli9+cLl9p4msiLgbP3x9mZ46s\njtYl0tSSL7hPoF0uP0QQoB7n6TmQqhY6K2dM/lax9x5CRcmDJLBwqZPFi1TnPJOr\nAy/o9LeQoLSKzEcF0YtiwjghQi4cw+2oNbH/pwIDAQABAoIBAQCIa/fFq2mY8iYR\n+uUjIo06raNoSiBu68Tin695v4PBDCZ7c19u7sTEzfH0CZlvmXg+BjJQEUSvYzLg\nNVJ15ZtWJ0AZ27jDf4oH1Y+9GleKbzKHPaoz/Ji5jAR0WgdRxYBeByOo4AZ62ShS\n9mXa4yiTw5yNi6R1/wSalRxUFARaeYBbRSZTawU24C4hyZZFEKO3QlxbhBaAfsJP\nDVGftkL9mdCHJLvA4/7IXZsmpErkhaXP98B1FaY3zE+qefGcLFRLYbAxjbCOAX6z\nAD3yjk3e66DKxHF1Wxva4u30aPZfODPCkCgPwxuZq8Tz+VNh4j5cS5C13etukBV4\nB31Brb8pAoGBAOFzZ8IMcz1GZxeIgarb5AQHbi0rZiPZwJF4/pLa9U4Bg0maj97t\nemWRomuVEtM/bI5Dva+YzQnei49pDPnTMAqPLRbfOeruFBlGxJlPbaKguR5qAQar\n2imkhvjOq3/bV7PonP6JE6hxqfwAoMtxpPYKuKymSDdZ+imFFNiu/fiNAoGBAMEg\nwjGyukiXppjKYPyXnjJOuzajvq1+o2h6l216tYMSlvRlbM8EINYbg6yKLia0yHDl\n9wVD4vEU6BYZ5OmXDT0hSF00+wx1lQi4YM2u+va00dthpgUDxXi/FUctlJZuRpOW\nzK1JKpFl/znIMxME6d+DN+yNqGMM2hMatQAVee4DAoGAKWeMcrLepy462LOVPM/N\nfH/w2BLUW1kuaIkUF9xmmMDmX6onKgXrKKQqdB+YqXtIcIg4WftyDJH2h4v/ehIz\nDH1nBoBQnrjCsDGzAYT42Zky5kcJkTQWiPdSYndyP7UE0mGyE30RQyo80a872KEy\nbo1hhTO0p5W6v81VGsZoljECgYBwzjmf3c2BaVMeG9faspTsvaAMokhV/opkFHcu\ns2YiUVFrH3MW2Ep1xUx8E5oxcZdCmpBWuvhr6NJHVoinCFvrQO2Lw85/0I5ksY2Z\nloNwZt3NTpQyialmhfZfxPfthiwjOQoEjaAXnYQetBlhGpWgwHyB55xbfr5COm9O\nxTybEQKBgALIfybfST7EfUZszLen+/PyXPfCHKybTwEHHYfwwwFHmiVuMLCbsXIR\nPjOPl29jHcSiSutMQZbnKDZ3UgNnx9O31lSzS7ygC50pK1QpzPBXKZMGGnS4UGSd\nTBa+FKJuFAeVeRnoDKnTRFSRIGwvu4vDKLmXBv1728XWKG3GHDot\n-----END RSA PRIVATE KEY-----\n	-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqhTaq3zCpRnFoQzHheYB\nfwcdjjczJ4pSKwsq1qJmydctdZM6gScZfgObg0mY7Y1UrnlQDw5RB6Py8hFmGGEh\n/wJm8mqxx473L+noX8X49jhFuv5OsnWTDLMbo497hCaZoD5/7y/zlfgYzGp2Llt8\nGKmX9Cg8W1G52dZlNq/HbEygg0W7vq2LBPJvuTAE0RH2jxKU+JCsVhfaUzEFUlcr\nJyXli9+cLl9p4msiLgbP3x9mZ46sjtYl0tSSL7hPoF0uP0QQoB7n6TmQqhY6K2dM\n/lax9x5CRcmDJLBwqZPFi1TnPJOrAy/o9LeQoLSKzEcF0YtiwjghQi4cw+2oNbH/\npwIDAQAB\n-----END PUBLIC KEY-----\n				2018-03-06 03:50:49.164137	2018-03-06 03:50:49.164137				\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f		0	5	0	\N					0	f	\N	\N	\N	\N
6	LockedAccount	\N		-----BEGIN RSA PRIVATE KEY-----\nMIIEpgIBAAKCAQEA6HayWvdAVUdIeabZBP8fpdvaBUWyFflzdHXU3lQ7ZtQpfWm0\nYTTA9/rTPUnZvc6GxRkfs5onWgwb5PBRFpWYxv4X6QP79CH4RVXJtJK9eGzVtNib\nzGrs/M8eH0TW9Lv+daOyh/QKrll7cGTR+vD8BeRORubkxU37kSphFiYNOi4/gkkD\n9Lz8R6IPMf3Mp3+tTJhTk8MRCW/GHNLTsY9qUlmeMXRrHeEdIHuIQrHCkqASZjMz\nA6pawaHw2B4RMWAsI3xj6FXUK5iaNHm9ad3+2WDcDU3bR/uQulIPddnjoNhMDXOd\n8pyHGIPeAhKPd6m22wXhw3H8YfZ+QpAYi8pOSQIDAQABAoIBAQC0EtaAjs2AAfML\ngYrVSwfqBE90DBQy34RnL6vQ+fD1692j79EyB5p/vgYKkP2iAaz2W0rqZrybDYxC\nIUK/Ou0ZINXGxDZVXEck9pqETbOF6ND3AWBWznF8OLj9wea9uC8aU89Fb28iteBg\nJUlfmXOw4LUeSVfn20vHnMuOS7WtXZGlbHt6KA29vLKOXCSSdlBkq+NJr+GwGy8Q\n6l1ZM7bOkMral2FHFd3LK2d94+F1lbKsNnA/IPgUk9EY0P8wjOMJ0ThRQu28s9G4\nX0GxXQ/+utO98yzdJ6vsKPLotsrW7DQizuo/h66USvHHrgiDmBo6vXOPASAUWWho\nvm1VKykxAoGBAP/vju1pSOySHqQU/b3QcLzHSVm7U47BVt7/eZzvydmAMFpCFX5I\n0woKBLQAXibwOaJu2avGbvmpckmWC/BjlQEDpGKWmZpgCORVYY8vjp/k0tLMgZfd\nJprjAwVFg03YObLsxDxNnLxlJar2gVbzFn82XfC4L+GIiHkP++D0bUSVAoGBAOiF\noWjsWFpAH5Zxx1lFggx6LESDmOWlo5WzXChP2l8iZEb/wNBJ3LKU14szIuJXCsQM\nOH3Yz8XwiU2bUz5pWpQNoitP349BNqzjuUXJ91by2KUOjvX5ycZ8hYfAnWgAv75A\nZy+CH+XUiS1wjV9MNdap7/GqvlrxqtSud697ceHlAoGBAO2B0G99bxErIIhAeqD1\nmEl33xgIgShPP2C+UItU80qGbVi1TuDckAwW8/pfBQC5maKloBaKlV3W45pqRjYV\nE6fXS2u6Ol1KlbXfjiOkjITRgtvgsLrPng3KcXko4wsQh6sFka4skDE85FHdZHXe\nLJhtSYwkQTrYy10dei9uZSBpAoGBAOeTHvwWVrAbqNn2mymHlkvC6Y+a2I3ud4tC\nRIhJbxzMbb5gPLG0vj6FCl4yIY32TlyOJzz+z389XiGSjkdcOb+2DErCk85ijoeF\njSG6UcGgvq80XqEPkytBHOPkq1/HTy+1iI7CM+57y9sbe1Dr37rZKIUxHcAJa6/B\nyqVUdkkZAoGBAIRLMM2TmPHH33tjYTR1WHtGR1/7D3cose5zOqGCu4zx2I0e9m+p\nMmaYl0gtr0CfFesQVtLTRuoTPXfDwaTECEuKpGrQTjUUHjC7MgEP0T6odmx2rlfQ\nmdNa6lJrZA8jscz5kcYoHjlr9KamkmtnaOSwPp+sQDWNB/kSoEMZxXyC\n-----END RSA PRIVATE KEY-----\n	-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6HayWvdAVUdIeabZBP8f\npdvaBUWyFflzdHXU3lQ7ZtQpfWm0YTTA9/rTPUnZvc6GxRkfs5onWgwb5PBRFpWY\nxv4X6QP79CH4RVXJtJK9eGzVtNibzGrs/M8eH0TW9Lv+daOyh/QKrll7cGTR+vD8\nBeRORubkxU37kSphFiYNOi4/gkkD9Lz8R6IPMf3Mp3+tTJhTk8MRCW/GHNLTsY9q\nUlmeMXRrHeEdIHuIQrHCkqASZjMzA6pawaHw2B4RMWAsI3xj6FXUK5iaNHm9ad3+\n2WDcDU3bR/uQulIPddnjoNhMDXOd8pyHGIPeAhKPd6m22wXhw3H8YfZ+QpAYi8pO\nSQIDAQAB\n-----END PUBLIC KEY-----\n				2018-03-15 04:07:23.996029	2018-03-15 04:33:45.479283				\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	t		0	0	1	\N					0	f	\N	\N	\N	\N
\.


--
-- Data for Name: admin_action_logs; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.admin_action_logs (id, account_id, action, target_type, target_id, recorded_changes, created_at, updated_at) FROM stdin;
1	1	create	CustomEmoji	1	---\nid: 1\nshortcode: blobpats\ndomain: \nimage_file_name: blobpats.png\nimage_content_type: image/png\nimage_file_size: 11087\nimage_updated_at: !ruby/object:ActiveSupport::TimeWithZone\n  utc: &1 2018-03-06 17:02:54.574428000 Z\n  zone: &2 !ruby/object:ActiveSupport::TimeZone\n    name: Etc/UTC\n  time: *1\ncreated_at: !ruby/object:ActiveSupport::TimeWithZone\n  utc: &3 2018-03-06 17:02:54.753665000 Z\n  zone: *2\n  time: *3\nupdated_at: !ruby/object:ActiveSupport::TimeWithZone\n  utc: *3\n  zone: *2\n  time: *3\ndisabled: false\nuri: \nimage_remote_url: \nvisible_in_picker: true\n	2018-03-06 17:02:54.830036	2018-03-06 17:02:54.830036
2	1	create	CustomEmoji	2	---\nid: 2\nshortcode: blobpeek\ndomain: \nimage_file_name: blobpeek.png\nimage_content_type: image/png\nimage_file_size: 9135\nimage_updated_at: !ruby/object:ActiveSupport::TimeWithZone\n  utc: &1 2018-03-06 17:03:10.272121000 Z\n  zone: &2 !ruby/object:ActiveSupport::TimeZone\n    name: Etc/UTC\n  time: *1\ncreated_at: !ruby/object:ActiveSupport::TimeWithZone\n  utc: &3 2018-03-06 17:03:10.360884000 Z\n  zone: *2\n  time: *3\nupdated_at: !ruby/object:ActiveSupport::TimeWithZone\n  utc: *3\n  zone: *2\n  time: *3\ndisabled: false\nuri: \nimage_remote_url: \nvisible_in_picker: true\n	2018-03-06 17:03:10.392351	2018-03-06 17:03:10.392351
3	1	create	CustomEmoji	3	---\nid: 3\nshortcode: blobnom\ndomain: \nimage_file_name: blobnom.png\nimage_content_type: image/png\nimage_file_size: 13053\nimage_updated_at: !ruby/object:ActiveSupport::TimeWithZone\n  utc: &1 2018-03-06 17:03:21.327244000 Z\n  zone: &2 !ruby/object:ActiveSupport::TimeZone\n    name: Etc/UTC\n  time: *1\ncreated_at: !ruby/object:ActiveSupport::TimeWithZone\n  utc: &3 2018-03-06 17:03:21.438791000 Z\n  zone: *2\n  time: *3\nupdated_at: !ruby/object:ActiveSupport::TimeWithZone\n  utc: *3\n  zone: *2\n  time: *3\ndisabled: false\nuri: \nimage_remote_url: \nvisible_in_picker: true\n	2018-03-06 17:03:21.468887	2018-03-06 17:03:21.468887
\.


--
-- Data for Name: ar_internal_metadata; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.ar_internal_metadata (key, value, created_at, updated_at) FROM stdin;
environment	development	2018-03-06 03:50:47.67559	2018-03-06 03:50:47.67559
\.


--
-- Data for Name: backups; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.backups (id, user_id, dump_file_name, dump_content_type, dump_file_size, dump_updated_at, processed, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: blocks; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.blocks (id, created_at, updated_at, account_id, target_account_id, uri) FROM stdin;
\.


--
-- Data for Name: conversation_mutes; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.conversation_mutes (id, conversation_id, account_id) FROM stdin;
\.


--
-- Data for Name: conversations; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.conversations (id, uri, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: custom_emojis; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.custom_emojis (id, shortcode, domain, image_file_name, image_content_type, image_file_size, image_updated_at, created_at, updated_at, disabled, uri, image_remote_url, visible_in_picker) FROM stdin;
1	blobpats	\N	blobpats.png	image/png	11087	2018-03-06 17:02:54.574428	2018-03-06 17:02:54.753665	2018-03-06 17:02:54.753665	f	\N	\N	t
2	blobpeek	\N	blobpeek.png	image/png	9135	2018-03-06 17:03:10.272121	2018-03-06 17:03:10.360884	2018-03-06 17:03:10.360884	f	\N	\N	t
3	blobnom	\N	blobnom.png	image/png	13053	2018-03-06 17:03:21.327244	2018-03-06 17:03:21.438791	2018-03-06 17:03:21.438791	f	\N	\N	t
\.


--
-- Data for Name: custom_filters; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.custom_filters (id, account_id, expires_at, phrase, context, irreversible, created_at, updated_at, whole_word) FROM stdin;
\.


--
-- Data for Name: domain_blocks; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.domain_blocks (id, domain, created_at, updated_at, severity, reject_media, reject_reports) FROM stdin;
\.


--
-- Data for Name: email_domain_blocks; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.email_domain_blocks (id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: favourites; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.favourites (id, created_at, updated_at, account_id, status_id) FROM stdin;
\.


--
-- Data for Name: follow_requests; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.follow_requests (id, created_at, updated_at, account_id, target_account_id, show_reblogs, uri) FROM stdin;
\.


--
-- Data for Name: follows; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.follows (id, created_at, updated_at, account_id, target_account_id, show_reblogs, uri) FROM stdin;
1	2018-03-06 03:52:28.049515	2018-03-06 03:52:28.049515	2	1	t	\N
2	2018-03-06 03:52:56.891683	2018-03-06 03:52:56.891683	3	1	t	\N
3	2018-03-06 03:53:56.148659	2018-03-06 03:53:56.148659	4	1	t	\N
4	2018-03-08 17:13:30.3398	2018-03-08 17:13:30.3398	5	1	t	\N
5	2018-03-15 04:07:36.361956	2018-03-15 04:07:36.361956	6	1	t	\N
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.identities (id, user_id, provider, uid, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: imports; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.imports (id, type, approved, created_at, updated_at, data_file_name, data_content_type, data_file_size, data_updated_at, account_id) FROM stdin;
\.


--
-- Data for Name: invites; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.invites (id, user_id, code, expires_at, max_uses, uses, created_at, updated_at, autofollow) FROM stdin;
\.


--
-- Data for Name: list_accounts; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.list_accounts (id, list_id, account_id, follow_id) FROM stdin;
\.


--
-- Data for Name: lists; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.lists (id, account_id, title, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: media_attachments; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.media_attachments (id, status_id, file_file_name, file_content_type, file_file_size, file_updated_at, remote_url, created_at, updated_at, shortcode, type, file_meta, account_id, description) FROM stdin;
\.


--
-- Data for Name: mentions; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.mentions (id, status_id, created_at, updated_at, account_id, silent) FROM stdin;
\.


--
-- Data for Name: mutes; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.mutes (id, created_at, updated_at, account_id, target_account_id, hide_notifications) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.notifications (id, activity_id, activity_type, created_at, updated_at, account_id, from_account_id) FROM stdin;
1	1	Follow	2018-03-06 03:52:28.202361	2018-03-06 03:52:28.202361	1	2
2	2	Follow	2018-03-06 03:52:57.117077	2018-03-06 03:52:57.117077	1	3
3	3	Follow	2018-03-06 03:53:56.212939	2018-03-06 03:53:56.212939	1	4
4	4	Follow	2018-03-08 17:13:30.636622	2018-03-08 17:13:30.636622	1	5
5	5	Follow	2018-03-15 04:07:36.656928	2018-03-15 04:07:36.656928	1	6
\.


--
-- Data for Name: oauth_access_grants; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.oauth_access_grants (id, token, expires_in, redirect_uri, created_at, revoked_at, scopes, application_id, resource_owner_id) FROM stdin;
\.


--
-- Data for Name: oauth_access_tokens; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.oauth_access_tokens (id, token, refresh_token, expires_in, revoked_at, created_at, scopes, application_id, resource_owner_id) FROM stdin;
1	e9a463ba1729ae0049a97a312af702cb3d08d84de1cc8d6da3fad90af068117b	\N	\N	\N	2018-03-06 03:54:07.530641	read write follow	1	4
2	f954c8de1fcc0080ff706fa2516d05b60de0d8f5b536255a85ef85a6c32e4afb	\N	\N	\N	2018-03-06 04:56:52.127914	read write follow	1	1
3	b48d72074a467e77a18eafc0d52e373dcf2492bcb3fefadc302a81300ec69002	\N	\N	\N	2018-03-06 04:57:40.866461	read write follow	1	2
4	894d3583dbf7d0f4f4784a06db86bdadb6ef0d99453d15afbc03e0c103bd78af	\N	\N	\N	2018-03-06 04:58:05.724937	read write follow	1	3
6	0639238783efdfde849304bc89ec0c4b60b5ef5f261f60859fcd597de081cfdc	\N	\N	\N	2018-03-08 17:13:40.045338	read write follow	1	5
7	39ed9aeffa4b25eda4940f22f29fea66e625c6282c2a8bf0430203c9779e9e98	\N	\N	\N	2018-03-15 04:07:55.095858	read write follow	1	6
8	a2f0bc5a65d7d0e971bdd63c83f01948150f17739425890d154e20b528480ab8	\N	\N	\N	2018-03-15 04:33:24.989472	read write follow	1	6
9	8ef64835d2d68769072d52b4771d86fc44fc0caeaca3040cb904a8f1f6904f92	\N	\N	\N	2018-03-15 04:58:42.550623	read write follow	1	6
\.


--
-- Data for Name: oauth_applications; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.oauth_applications (id, name, uid, secret, redirect_uri, scopes, created_at, updated_at, superapp, website, owner_type, owner_id, confidential) FROM stdin;
1	Web	376d13061ec170c84519ae921ff81056188764ceb6d5a68e0368ad028ae0d03d	f2637a09a9f1121fde9713e3a9ecef4f49fc5a4dccb3357df3239b702eaa50ae	urn:ietf:wg:oauth:2.0:oob	read write follow	2018-03-06 03:50:48.998748	2018-03-06 03:50:48.998748	t	\N	\N	\N	t
\.


--
-- Data for Name: pghero_space_stats; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.pghero_space_stats (id, database, schema, relation, size, captured_at) FROM stdin;
\.


--
-- Data for Name: preview_cards; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.preview_cards (id, url, title, description, image_file_name, image_content_type, image_file_size, image_updated_at, type, html, author_name, author_url, provider_name, provider_url, width, height, created_at, updated_at, embed_url) FROM stdin;
\.


--
-- Data for Name: preview_cards_statuses; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.preview_cards_statuses (preview_card_id, status_id) FROM stdin;
\.


--
-- Data for Name: relays; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.relays (id, inbox_url, follow_activity_id, created_at, updated_at, state) FROM stdin;
\.


--
-- Data for Name: report_notes; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.report_notes (id, content, report_id, account_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.reports (id, status_ids, comment, action_taken, created_at, updated_at, account_id, action_taken_by_account_id, target_account_id, assigned_account_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.schema_migrations (version) FROM stdin;
20180106000232
20160220174730
20160220211917
20160221003140
20160221003621
20160222122600
20160222143943
20160223162837
20160223164502
20160223165723
20160223165855
20160223171800
20160224223247
20160227230233
20160305115639
20160306172223
20160312193225
20160314164231
20160316103650
20160322193748
20160325130944
20160826155805
20160905150353
20160919221059
20160920003904
20160926213048
20161003142332
20161003145426
20161006213403
20161009120834
20161027172456
20161104173623
20161105130633
20161116162355
20161119211120
20161122163057
20161123093447
20161128103007
20161130142058
20161130185319
20161202132159
20161203164520
20161205214545
20161221152630
20161222201034
20161222204147
20170105224407
20170109120109
20170112154826
20170114194937
20170114203041
20170119214911
20170123162658
20170123203248
20170125145934
20170127165745
20170129000348
20170205175257
20170209184350
20170214110202
20170217012631
20170301222600
20170303212857
20170304202101
20170317193015
20170318214217
20170322021028
20170322143850
20170322162804
20170330021336
20170330163835
20170330164118
20170403172249
20170405112956
20170406215816
20170409170753
20170414080609
20170414132105
20170418160728
20170423005413
20170424003227
20170424112722
20170425131920
20170425202925
20170427011934
20170506235850
20170507000211
20170507141759
20170508230434
20170516072309
20170520145338
20170601210557
20170604144747
20170606113804
20170609145826
20170610000000
20170623152212
20170624134742
20170625140443
20170711225116
20170713112503
20170713175513
20170713190709
20170714184731
20170716191202
20170718211102
20170720000000
20170823162448
20170824103029
20170829215220
20170901141119
20170901142658
20170905044538
20170905165803
20170913000752
20170917153509
20170918125918
20170920024819
20170920032311
20170924022025
20170927215609
20170928082043
20171005102658
20171005171936
20171006142024
20171010023049
20171010025614
20171020084748
20171028221157
20171107143332
20171107143624
20171109012327
20171114080328
20171114231651
20171116161857
20171118012443
20171119172437
20171122120436
20171125024930
20171125031751
20171125185353
20171125190735
20171129172043
20171130000000
20171201000000
20171212195226
20171226094803
20180109143959
20180204034416
20180206000000
20180211015820
20180304013859
20180310000000
20180402031200
20180402040909
20180410204633
20180416210259
20180506221944
20180510214435
20180510230049
20180514130000
20180514140000
20180528141303
20180608213548
20180609104432
20180615122121
20180616192031
20180617162849
20180628181026
20180707154237
20180711152640
20180808175627
20180812123222
20180812162710
20180812173710
20180813113448
20180814171349
20180820232245
20180929222014
20181007025445
20181010141500
20181017170937
20181018205649
20181024224956
20181026034033
\.


--
-- Data for Name: session_activations; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.session_activations (id, session_id, created_at, updated_at, user_agent, ip, access_token_id, user_id, web_push_subscription_id) FROM stdin;
1	794901e52b435405ca39610b9391dedf	2018-03-06 03:54:07.43064	2018-03-06 03:54:07.43064	Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:58.0) Gecko/20100101 Firefox/58.0	127.0.0.1	1	4	\N
2	e94d79d0df271b2d7ca4c2ab055636ae	2018-03-06 04:56:52.094695	2018-03-06 04:56:52.094695	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36	127.0.0.1	2	1	\N
3	d76fc8e8d8169c3ec5ad67c141454f0d	2018-03-06 04:57:40.864568	2018-03-06 04:57:40.864568	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36	127.0.0.1	3	2	\N
4	7d2c8471dbb94211447e3a2e8130dc99	2018-03-06 04:58:05.707284	2018-03-06 04:58:05.707284	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36	127.0.0.1	4	3	\N
6	1c1e3a649ec1e2366d389f1dc079c671	2018-03-08 17:13:40.0169	2018-03-08 17:13:40.0169	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36	127.0.0.1	6	5	\N
7	f844efc7d2dbc81c1fe2151ac3d61bbe	2018-03-15 04:07:55.038088	2018-03-15 04:07:55.038088	Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:59.0) Gecko/20100101 Firefox/59.0	127.0.0.1	7	6	\N
8	635fcbad4a6fe81524ff3ac9a9b11e8a	2018-03-15 04:33:24.95958	2018-03-15 04:33:24.95958	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36	127.0.0.1	8	6	\N
9	a8ef396160f8e1babdcc75ab903926a9	2018-03-15 04:58:42.504138	2018-03-15 04:58:42.504138	Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:59.0) Gecko/20100101 Firefox/59.0	127.0.0.1	9	6	\N
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.settings (id, var, value, thing_type, created_at, updated_at, thing_id) FROM stdin;
1	notification_emails	---\nfollow: false\nreblog: false\nfavourite: false\nmention: false\nfollow_request: false\ndigest: true\n	User	2018-03-15 04:59:04.574423	2018-03-15 04:59:04.574423	6
2	interactions	---\nmust_be_follower: false\nmust_be_following: false\nmust_be_following_dm: false\n	User	2018-03-15 04:59:04.605717	2018-03-15 04:59:04.605717	6
\.


--
-- Data for Name: site_uploads; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.site_uploads (id, var, file_file_name, file_content_type, file_file_size, file_updated_at, meta, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: status_pins; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.status_pins (id, account_id, status_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: status_stats; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.status_stats (id, status_id, replies_count, reblogs_count, favourites_count, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: statuses; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.statuses (id, uri, text, created_at, updated_at, in_reply_to_id, reblog_of_id, url, sensitive, visibility, spoiler_text, reply, language, conversation_id, local, account_id, application_id, in_reply_to_account_id) FROM stdin;
\.


--
-- Data for Name: statuses_tags; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.statuses_tags (status_id, tag_id) FROM stdin;
\.


--
-- Data for Name: stream_entries; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.stream_entries (id, activity_id, activity_type, created_at, updated_at, hidden, account_id) FROM stdin;
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.subscriptions (id, callback_url, secret, expires_at, confirmed, created_at, updated_at, last_successful_delivery_at, domain, account_id) FROM stdin;
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.tags (id, name, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.users (id, email, created_at, updated_at, encrypted_password, reset_password_token, reset_password_sent_at, remember_created_at, sign_in_count, current_sign_in_at, last_sign_in_at, current_sign_in_ip, last_sign_in_ip, admin, confirmation_token, confirmed_at, confirmation_sent_at, unconfirmed_email, locale, encrypted_otp_secret, encrypted_otp_secret_iv, encrypted_otp_secret_salt, consumed_timestep, otp_required_for_login, last_emailed_at, otp_backup_codes, filtered_languages, account_id, disabled, moderator, invite_id, remember_token, chosen_languages) FROM stdin;
4	externallinks@localhost:3000	2018-03-06 03:53:52.59743	2018-03-06 03:54:07.597338	$2a$10$j6UVhj3pm2ZivOrm9sGbcuPtw49kqvpggbyt.IcCX/sm9Mqr2W2lW	\N	\N	2018-03-06 03:54:07.592013	1	2018-03-06 03:54:07.569021	2018-03-06 03:54:07.569021	127.0.0.1	127.0.0.1	f	1wHx7PBsMfgkwz36yVSq	2018-03-06 03:53:56.002257	2018-03-06 03:53:52.597832	\N	en	\N	\N	\N	\N	f	\N	\N	{}	4	f	f	\N	\N	\N
2	foobar@localhost:3000	2018-03-06 03:52:21.15566	2018-03-06 04:57:40.899388	$2a$10$uOJGEfYP4JcR6cdKASsuAe3EYc44ClEjY3IsL9cwupgAsKXNvsMB6	\N	\N	2018-03-06 04:57:40.898036	1	2018-03-06 04:57:40.87839	2018-03-06 04:57:40.87839	127.0.0.1	127.0.0.1	f	9tZRP_PZyyQ6hQmx88hX	2018-03-06 03:52:26.359	2018-03-06 03:52:21.156096	\N	en	\N	\N	\N	\N	f	\N	\N	{}	2	f	f	\N	\N	\N
3	quux@localhost:3000	2018-03-06 03:52:52.825436	2018-03-06 04:58:05.758893	$2a$10$nSVOaz2ACr7hizj57HbbCOnBgaj20teuuSBHYFQdKboPAE8o8AWtu	\N	\N	2018-03-06 04:58:05.757671	1	2018-03-06 04:58:05.7443	2018-03-06 04:58:05.7443	127.0.0.1	127.0.0.1	f	LZkd9hZPQby-DJR7q2xK	2018-03-06 03:52:56.722007	2018-03-06 03:52:52.825895	\N	en	\N	\N	\N	\N	f	\N	\N	{}	3	f	f	\N	\N	\N
1	admin@localhost:3000	2018-03-06 03:50:49.649613	2018-03-06 17:03:26.537681	$2a$10$7DkNPkzyI1KdM8xDPE4LmuKz3VCDZGTiUVUSlX5De4RFBNfYmS27i	\N	\N	\N	2	2018-03-06 16:53:21.708118	2018-03-06 04:56:52.178652	127.0.0.1	127.0.0.1	t	\N	2018-03-06 03:50:49.482892	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	{}	1	f	f	\N	\N	\N
5	baz@localhost:3000	2018-03-08 17:13:19.88529	2018-03-08 17:13:40.093697	$2a$10$eqGdrqmSUEfA4q.7qxjp1eFdMxSUGlNJMpnOG.zxE6ogyDUj9t8GO	\N	\N	2018-03-08 17:13:40.092268	1	2018-03-08 17:13:40.06976	2018-03-08 17:13:40.06976	127.0.0.1	127.0.0.1	f	K5TLBFADUUD-51oaCMfL	2018-03-08 17:13:29.253941	2018-03-08 17:13:19.885632	\N	en	\N	\N	\N	\N	f	\N	\N	{}	5	f	f	\N	\N	\N
6	lockedaccount@localhost:3000	2018-03-15 04:07:24.10397	2018-03-15 04:58:42.615377	$2a$10$PGDn6VtjTR0BSbK4MY/aR.T0qJZ/wtziTXH0ySJr7x3.3XsZ/1qwm	\N	\N	2018-03-15 04:07:55.142233	3	2018-03-15 04:58:42.60349	2018-03-15 04:33:25.042573	127.0.0.1	127.0.0.1	f	spRH4F8MUisS5i_uzTiS	2018-03-15 04:07:34.297881	2018-03-15 04:07:24.105731	\N	en	\N	\N	\N	\N	f	\N	\N	{}	6	f	f	\N	\N	\N
\.


--
-- Data for Name: web_push_subscriptions; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.web_push_subscriptions (id, endpoint, key_p256dh, key_auth, data, created_at, updated_at, access_token_id, user_id) FROM stdin;
\.


--
-- Data for Name: web_settings; Type: TABLE DATA; Schema: public; Owner: pinafore
--

COPY public.web_settings (id, data, created_at, updated_at, user_id) FROM stdin;
1	{"onboarded":true,"skinTone":1,"home":{"shows":{"reblog":true,"reply":true},"regex":{"body":""}},"notifications":{"alerts":{"follow":true,"favourite":true,"reblog":true,"mention":true},"shows":{"follow":true,"favourite":true,"reblog":true,"mention":true},"sounds":{"follow":true,"favourite":true,"reblog":true,"mention":true}},"community":{"regex":{"body":""}},"public":{"regex":{"body":""}},"columns":[{"id":"COMPOSE","uuid":"68d78b81-9453-4dfe-9c38-5a077ad19445","params":{}},{"id":"HOME","uuid":"d6de85e8-9b46-46a4-806a-dd6063e3bf1e","params":{}},{"id":"NOTIFICATIONS","uuid":"2b7958e4-e1dd-498d-9708-e875e8446d74","params":{}}]}	2018-03-06 04:56:58.130081	2018-03-06 04:56:58.130081	1
2	{"onboarded":true,"skinTone":1,"home":{"shows":{"reblog":true,"reply":true},"regex":{"body":""}},"notifications":{"alerts":{"follow":true,"favourite":true,"reblog":true,"mention":true},"shows":{"follow":true,"favourite":true,"reblog":true,"mention":true},"sounds":{"follow":true,"favourite":true,"reblog":true,"mention":true}},"community":{"regex":{"body":""}},"public":{"regex":{"body":""}},"columns":[{"id":"COMPOSE","uuid":"ccf71fa5-037e-447d-8f03-34d9c3fba0f9","params":{}},{"id":"HOME","uuid":"09a142e2-9681-4584-80f5-f98c7f02b9ac","params":{}},{"id":"NOTIFICATIONS","uuid":"f1985ade-2ee6-4d4b-a4e0-545add8fabb3","params":{}}]}	2018-03-06 04:57:46.789709	2018-03-06 04:57:46.789709	2
3	{"onboarded":true,"skinTone":1,"home":{"shows":{"reblog":true,"reply":true},"regex":{"body":""}},"notifications":{"alerts":{"follow":true,"favourite":true,"reblog":true,"mention":true},"shows":{"follow":true,"favourite":true,"reblog":true,"mention":true},"sounds":{"follow":true,"favourite":true,"reblog":true,"mention":true}},"community":{"regex":{"body":""}},"public":{"regex":{"body":""}},"columns":[{"id":"COMPOSE","uuid":"a31cb067-99a7-42e5-855a-518a851eef51","params":{}},{"id":"HOME","uuid":"e72285de-fde1-4939-9640-84098f301af1","params":{}},{"id":"NOTIFICATIONS","uuid":"86509c82-e0d8-4768-b4fe-71cd908e5ad7","params":{}}]}	2018-03-08 17:13:46.311542	2018-03-08 17:13:46.311542	5
4	{"onboarded":true,"skinTone":1,"home":{"shows":{"reblog":true,"reply":true},"regex":{"body":""}},"notifications":{"alerts":{"follow":true,"favourite":true,"reblog":true,"mention":true},"shows":{"follow":true,"favourite":true,"reblog":true,"mention":true},"sounds":{"follow":true,"favourite":true,"reblog":true,"mention":true}},"community":{"regex":{"body":""}},"public":{"regex":{"body":""}},"columns":[{"id":"COMPOSE","uuid":"534d5170-4e10-4ed3-9329-c864d8fd8386","params":{}},{"id":"HOME","uuid":"1a920c13-a8a7-481c-868d-e88fac754b8f","params":{}},{"id":"NOTIFICATIONS","uuid":"76869a99-a78a-47f5-8938-3f56d5e3a217","params":{}}]}	2018-03-15 04:08:02.30709	2018-03-15 04:08:02.30709	6
\.


--
-- Name: account_conversations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.account_conversations_id_seq', 1, false);


--
-- Name: account_domain_blocks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.account_domain_blocks_id_seq', 1, false);


--
-- Name: account_moderation_notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.account_moderation_notes_id_seq', 1, false);


--
-- Name: account_pins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.account_pins_id_seq', 1, false);


--
-- Name: accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.accounts_id_seq', 6, true);


--
-- Name: admin_action_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.admin_action_logs_id_seq', 3, true);


--
-- Name: backups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.backups_id_seq', 1, false);


--
-- Name: blocks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.blocks_id_seq', 1, false);


--
-- Name: conversation_mutes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.conversation_mutes_id_seq', 1, false);


--
-- Name: conversations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.conversations_id_seq', 1, false);


--
-- Name: custom_emojis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.custom_emojis_id_seq', 3, true);


--
-- Name: custom_filters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.custom_filters_id_seq', 1, false);


--
-- Name: domain_blocks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.domain_blocks_id_seq', 1, false);


--
-- Name: email_domain_blocks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.email_domain_blocks_id_seq', 1, false);


--
-- Name: favourites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.favourites_id_seq', 1, false);


--
-- Name: follow_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.follow_requests_id_seq', 1, false);


--
-- Name: follows_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.follows_id_seq', 5, true);


--
-- Name: identities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.identities_id_seq', 1, false);


--
-- Name: imports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.imports_id_seq', 1, false);


--
-- Name: invites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.invites_id_seq', 1, false);


--
-- Name: list_accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.list_accounts_id_seq', 1, false);


--
-- Name: lists_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.lists_id_seq', 1, false);


--
-- Name: media_attachments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.media_attachments_id_seq', 1, false);


--
-- Name: mentions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.mentions_id_seq', 1, false);


--
-- Name: mutes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.mutes_id_seq', 1, false);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.notifications_id_seq', 5, true);


--
-- Name: oauth_access_grants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.oauth_access_grants_id_seq', 1, false);


--
-- Name: oauth_access_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.oauth_access_tokens_id_seq', 9, true);


--
-- Name: oauth_applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.oauth_applications_id_seq', 1, true);


--
-- Name: pghero_space_stats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.pghero_space_stats_id_seq', 1, false);


--
-- Name: preview_cards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.preview_cards_id_seq', 1, false);


--
-- Name: relays_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.relays_id_seq', 1, false);


--
-- Name: report_notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.report_notes_id_seq', 1, false);


--
-- Name: reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.reports_id_seq', 1, false);


--
-- Name: session_activations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.session_activations_id_seq', 9, true);


--
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.settings_id_seq', 2, true);


--
-- Name: site_uploads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.site_uploads_id_seq', 1, false);


--
-- Name: status_pins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.status_pins_id_seq', 1, false);


--
-- Name: status_stats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.status_stats_id_seq', 1, false);


--
-- Name: statuses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.statuses_id_seq', 1, false);


--
-- Name: stream_entries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.stream_entries_id_seq', 1, false);


--
-- Name: subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.subscriptions_id_seq', 1, false);


--
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.tags_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- Name: web_push_subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.web_push_subscriptions_id_seq', 1, false);


--
-- Name: web_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pinafore
--

SELECT pg_catalog.setval('public.web_settings_id_seq', 4, true);


--
-- Name: account_conversations account_conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.account_conversations
    ADD CONSTRAINT account_conversations_pkey PRIMARY KEY (id);


--
-- Name: account_domain_blocks account_domain_blocks_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.account_domain_blocks
    ADD CONSTRAINT account_domain_blocks_pkey PRIMARY KEY (id);


--
-- Name: account_moderation_notes account_moderation_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.account_moderation_notes
    ADD CONSTRAINT account_moderation_notes_pkey PRIMARY KEY (id);


--
-- Name: account_pins account_pins_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.account_pins
    ADD CONSTRAINT account_pins_pkey PRIMARY KEY (id);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: admin_action_logs admin_action_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.admin_action_logs
    ADD CONSTRAINT admin_action_logs_pkey PRIMARY KEY (id);


--
-- Name: ar_internal_metadata ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


--
-- Name: backups backups_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.backups
    ADD CONSTRAINT backups_pkey PRIMARY KEY (id);


--
-- Name: blocks blocks_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.blocks
    ADD CONSTRAINT blocks_pkey PRIMARY KEY (id);


--
-- Name: conversation_mutes conversation_mutes_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.conversation_mutes
    ADD CONSTRAINT conversation_mutes_pkey PRIMARY KEY (id);


--
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- Name: custom_emojis custom_emojis_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.custom_emojis
    ADD CONSTRAINT custom_emojis_pkey PRIMARY KEY (id);


--
-- Name: custom_filters custom_filters_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.custom_filters
    ADD CONSTRAINT custom_filters_pkey PRIMARY KEY (id);


--
-- Name: domain_blocks domain_blocks_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.domain_blocks
    ADD CONSTRAINT domain_blocks_pkey PRIMARY KEY (id);


--
-- Name: email_domain_blocks email_domain_blocks_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.email_domain_blocks
    ADD CONSTRAINT email_domain_blocks_pkey PRIMARY KEY (id);


--
-- Name: favourites favourites_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.favourites
    ADD CONSTRAINT favourites_pkey PRIMARY KEY (id);


--
-- Name: follow_requests follow_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.follow_requests
    ADD CONSTRAINT follow_requests_pkey PRIMARY KEY (id);


--
-- Name: follows follows_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: imports imports_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.imports
    ADD CONSTRAINT imports_pkey PRIMARY KEY (id);


--
-- Name: invites invites_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.invites
    ADD CONSTRAINT invites_pkey PRIMARY KEY (id);


--
-- Name: list_accounts list_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.list_accounts
    ADD CONSTRAINT list_accounts_pkey PRIMARY KEY (id);


--
-- Name: lists lists_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.lists
    ADD CONSTRAINT lists_pkey PRIMARY KEY (id);


--
-- Name: media_attachments media_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.media_attachments
    ADD CONSTRAINT media_attachments_pkey PRIMARY KEY (id);


--
-- Name: mentions mentions_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.mentions
    ADD CONSTRAINT mentions_pkey PRIMARY KEY (id);


--
-- Name: mutes mutes_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.mutes
    ADD CONSTRAINT mutes_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: oauth_access_grants oauth_access_grants_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.oauth_access_grants
    ADD CONSTRAINT oauth_access_grants_pkey PRIMARY KEY (id);


--
-- Name: oauth_access_tokens oauth_access_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.oauth_access_tokens
    ADD CONSTRAINT oauth_access_tokens_pkey PRIMARY KEY (id);


--
-- Name: oauth_applications oauth_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.oauth_applications
    ADD CONSTRAINT oauth_applications_pkey PRIMARY KEY (id);


--
-- Name: pghero_space_stats pghero_space_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.pghero_space_stats
    ADD CONSTRAINT pghero_space_stats_pkey PRIMARY KEY (id);


--
-- Name: preview_cards preview_cards_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.preview_cards
    ADD CONSTRAINT preview_cards_pkey PRIMARY KEY (id);


--
-- Name: relays relays_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.relays
    ADD CONSTRAINT relays_pkey PRIMARY KEY (id);


--
-- Name: report_notes report_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.report_notes
    ADD CONSTRAINT report_notes_pkey PRIMARY KEY (id);


--
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: session_activations session_activations_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.session_activations
    ADD CONSTRAINT session_activations_pkey PRIMARY KEY (id);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: site_uploads site_uploads_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.site_uploads
    ADD CONSTRAINT site_uploads_pkey PRIMARY KEY (id);


--
-- Name: status_pins status_pins_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.status_pins
    ADD CONSTRAINT status_pins_pkey PRIMARY KEY (id);


--
-- Name: status_stats status_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.status_stats
    ADD CONSTRAINT status_stats_pkey PRIMARY KEY (id);


--
-- Name: statuses statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.statuses
    ADD CONSTRAINT statuses_pkey PRIMARY KEY (id);


--
-- Name: stream_entries stream_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.stream_entries
    ADD CONSTRAINT stream_entries_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: web_push_subscriptions web_push_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.web_push_subscriptions
    ADD CONSTRAINT web_push_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: web_settings web_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.web_settings
    ADD CONSTRAINT web_settings_pkey PRIMARY KEY (id);


--
-- Name: account_activity; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX account_activity ON public.notifications USING btree (account_id, activity_id, activity_type);


--
-- Name: hashtag_search_index; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX hashtag_search_index ON public.tags USING btree (lower((name)::text) text_pattern_ops);


--
-- Name: index_account_conversations_on_account_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_account_conversations_on_account_id ON public.account_conversations USING btree (account_id);


--
-- Name: index_account_conversations_on_conversation_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_account_conversations_on_conversation_id ON public.account_conversations USING btree (conversation_id);


--
-- Name: index_account_domain_blocks_on_account_id_and_domain; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_account_domain_blocks_on_account_id_and_domain ON public.account_domain_blocks USING btree (account_id, domain);


--
-- Name: index_account_moderation_notes_on_account_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_account_moderation_notes_on_account_id ON public.account_moderation_notes USING btree (account_id);


--
-- Name: index_account_moderation_notes_on_target_account_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_account_moderation_notes_on_target_account_id ON public.account_moderation_notes USING btree (target_account_id);


--
-- Name: index_account_pins_on_account_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_account_pins_on_account_id ON public.account_pins USING btree (account_id);


--
-- Name: index_account_pins_on_account_id_and_target_account_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_account_pins_on_account_id_and_target_account_id ON public.account_pins USING btree (account_id, target_account_id);


--
-- Name: index_account_pins_on_target_account_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_account_pins_on_target_account_id ON public.account_pins USING btree (target_account_id);


--
-- Name: index_accounts_on_moved_to_account_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_accounts_on_moved_to_account_id ON public.accounts USING btree (moved_to_account_id);


--
-- Name: index_accounts_on_uri; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_accounts_on_uri ON public.accounts USING btree (uri);


--
-- Name: index_accounts_on_url; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_accounts_on_url ON public.accounts USING btree (url);


--
-- Name: index_accounts_on_username_and_domain_lower; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_accounts_on_username_and_domain_lower ON public.accounts USING btree (lower((username)::text), lower((domain)::text));


--
-- Name: index_admin_action_logs_on_account_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_admin_action_logs_on_account_id ON public.admin_action_logs USING btree (account_id);


--
-- Name: index_admin_action_logs_on_target_type_and_target_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_admin_action_logs_on_target_type_and_target_id ON public.admin_action_logs USING btree (target_type, target_id);


--
-- Name: index_blocks_on_account_id_and_target_account_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_blocks_on_account_id_and_target_account_id ON public.blocks USING btree (account_id, target_account_id);


--
-- Name: index_blocks_on_target_account_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_blocks_on_target_account_id ON public.blocks USING btree (target_account_id);


--
-- Name: index_conversation_mutes_on_account_id_and_conversation_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_conversation_mutes_on_account_id_and_conversation_id ON public.conversation_mutes USING btree (account_id, conversation_id);


--
-- Name: index_conversations_on_uri; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_conversations_on_uri ON public.conversations USING btree (uri);


--
-- Name: index_custom_emojis_on_shortcode_and_domain; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_custom_emojis_on_shortcode_and_domain ON public.custom_emojis USING btree (shortcode, domain);


--
-- Name: index_custom_filters_on_account_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_custom_filters_on_account_id ON public.custom_filters USING btree (account_id);


--
-- Name: index_domain_blocks_on_domain; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_domain_blocks_on_domain ON public.domain_blocks USING btree (domain);


--
-- Name: index_email_domain_blocks_on_domain; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_email_domain_blocks_on_domain ON public.email_domain_blocks USING btree (domain);


--
-- Name: index_favourites_on_account_id_and_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_favourites_on_account_id_and_id ON public.favourites USING btree (account_id, id);


--
-- Name: index_favourites_on_account_id_and_status_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_favourites_on_account_id_and_status_id ON public.favourites USING btree (account_id, status_id);


--
-- Name: index_favourites_on_status_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_favourites_on_status_id ON public.favourites USING btree (status_id);


--
-- Name: index_follow_requests_on_account_id_and_target_account_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_follow_requests_on_account_id_and_target_account_id ON public.follow_requests USING btree (account_id, target_account_id);


--
-- Name: index_follows_on_account_id_and_target_account_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_follows_on_account_id_and_target_account_id ON public.follows USING btree (account_id, target_account_id);


--
-- Name: index_follows_on_target_account_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_follows_on_target_account_id ON public.follows USING btree (target_account_id);


--
-- Name: index_identities_on_user_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_identities_on_user_id ON public.identities USING btree (user_id);


--
-- Name: index_invites_on_code; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_invites_on_code ON public.invites USING btree (code);


--
-- Name: index_invites_on_user_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_invites_on_user_id ON public.invites USING btree (user_id);


--
-- Name: index_list_accounts_on_account_id_and_list_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_list_accounts_on_account_id_and_list_id ON public.list_accounts USING btree (account_id, list_id);


--
-- Name: index_list_accounts_on_follow_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_list_accounts_on_follow_id ON public.list_accounts USING btree (follow_id);


--
-- Name: index_list_accounts_on_list_id_and_account_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_list_accounts_on_list_id_and_account_id ON public.list_accounts USING btree (list_id, account_id);


--
-- Name: index_lists_on_account_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_lists_on_account_id ON public.lists USING btree (account_id);


--
-- Name: index_media_attachments_on_account_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_media_attachments_on_account_id ON public.media_attachments USING btree (account_id);


--
-- Name: index_media_attachments_on_shortcode; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_media_attachments_on_shortcode ON public.media_attachments USING btree (shortcode);


--
-- Name: index_media_attachments_on_status_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_media_attachments_on_status_id ON public.media_attachments USING btree (status_id);


--
-- Name: index_mentions_on_account_id_and_status_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_mentions_on_account_id_and_status_id ON public.mentions USING btree (account_id, status_id);


--
-- Name: index_mentions_on_status_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_mentions_on_status_id ON public.mentions USING btree (status_id);


--
-- Name: index_mutes_on_account_id_and_target_account_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_mutes_on_account_id_and_target_account_id ON public.mutes USING btree (account_id, target_account_id);


--
-- Name: index_mutes_on_target_account_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_mutes_on_target_account_id ON public.mutes USING btree (target_account_id);


--
-- Name: index_notifications_on_account_id_and_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_notifications_on_account_id_and_id ON public.notifications USING btree (account_id, id DESC);


--
-- Name: index_notifications_on_activity_id_and_activity_type; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_notifications_on_activity_id_and_activity_type ON public.notifications USING btree (activity_id, activity_type);


--
-- Name: index_notifications_on_from_account_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_notifications_on_from_account_id ON public.notifications USING btree (from_account_id);


--
-- Name: index_oauth_access_grants_on_resource_owner_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_oauth_access_grants_on_resource_owner_id ON public.oauth_access_grants USING btree (resource_owner_id);


--
-- Name: index_oauth_access_grants_on_token; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_oauth_access_grants_on_token ON public.oauth_access_grants USING btree (token);


--
-- Name: index_oauth_access_tokens_on_refresh_token; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_oauth_access_tokens_on_refresh_token ON public.oauth_access_tokens USING btree (refresh_token);


--
-- Name: index_oauth_access_tokens_on_resource_owner_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_oauth_access_tokens_on_resource_owner_id ON public.oauth_access_tokens USING btree (resource_owner_id);


--
-- Name: index_oauth_access_tokens_on_token; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_oauth_access_tokens_on_token ON public.oauth_access_tokens USING btree (token);


--
-- Name: index_oauth_applications_on_owner_id_and_owner_type; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_oauth_applications_on_owner_id_and_owner_type ON public.oauth_applications USING btree (owner_id, owner_type);


--
-- Name: index_oauth_applications_on_uid; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_oauth_applications_on_uid ON public.oauth_applications USING btree (uid);


--
-- Name: index_pghero_space_stats_on_database_and_captured_at; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_pghero_space_stats_on_database_and_captured_at ON public.pghero_space_stats USING btree (database, captured_at);


--
-- Name: index_preview_cards_on_url; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_preview_cards_on_url ON public.preview_cards USING btree (url);


--
-- Name: index_preview_cards_statuses_on_status_id_and_preview_card_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_preview_cards_statuses_on_status_id_and_preview_card_id ON public.preview_cards_statuses USING btree (status_id, preview_card_id);


--
-- Name: index_report_notes_on_account_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_report_notes_on_account_id ON public.report_notes USING btree (account_id);


--
-- Name: index_report_notes_on_report_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_report_notes_on_report_id ON public.report_notes USING btree (report_id);


--
-- Name: index_reports_on_account_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_reports_on_account_id ON public.reports USING btree (account_id);


--
-- Name: index_reports_on_target_account_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_reports_on_target_account_id ON public.reports USING btree (target_account_id);


--
-- Name: index_session_activations_on_access_token_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_session_activations_on_access_token_id ON public.session_activations USING btree (access_token_id);


--
-- Name: index_session_activations_on_session_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_session_activations_on_session_id ON public.session_activations USING btree (session_id);


--
-- Name: index_session_activations_on_user_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_session_activations_on_user_id ON public.session_activations USING btree (user_id);


--
-- Name: index_settings_on_thing_type_and_thing_id_and_var; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_settings_on_thing_type_and_thing_id_and_var ON public.settings USING btree (thing_type, thing_id, var);


--
-- Name: index_site_uploads_on_var; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_site_uploads_on_var ON public.site_uploads USING btree (var);


--
-- Name: index_status_pins_on_account_id_and_status_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_status_pins_on_account_id_and_status_id ON public.status_pins USING btree (account_id, status_id);


--
-- Name: index_status_stats_on_status_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_status_stats_on_status_id ON public.status_stats USING btree (status_id);


--
-- Name: index_statuses_20180106; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_statuses_20180106 ON public.statuses USING btree (account_id, id DESC, visibility, updated_at);


--
-- Name: index_statuses_on_in_reply_to_account_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_statuses_on_in_reply_to_account_id ON public.statuses USING btree (in_reply_to_account_id);


--
-- Name: index_statuses_on_in_reply_to_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_statuses_on_in_reply_to_id ON public.statuses USING btree (in_reply_to_id);


--
-- Name: index_statuses_on_reblog_of_id_and_account_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_statuses_on_reblog_of_id_and_account_id ON public.statuses USING btree (reblog_of_id, account_id);


--
-- Name: index_statuses_on_uri; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_statuses_on_uri ON public.statuses USING btree (uri);


--
-- Name: index_statuses_tags_on_status_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_statuses_tags_on_status_id ON public.statuses_tags USING btree (status_id);


--
-- Name: index_statuses_tags_on_tag_id_and_status_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_statuses_tags_on_tag_id_and_status_id ON public.statuses_tags USING btree (tag_id, status_id);


--
-- Name: index_stream_entries_on_account_id_and_activity_type_and_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_stream_entries_on_account_id_and_activity_type_and_id ON public.stream_entries USING btree (account_id, activity_type, id);


--
-- Name: index_stream_entries_on_activity_id_and_activity_type; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_stream_entries_on_activity_id_and_activity_type ON public.stream_entries USING btree (activity_id, activity_type);


--
-- Name: index_subscriptions_on_account_id_and_callback_url; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_subscriptions_on_account_id_and_callback_url ON public.subscriptions USING btree (account_id, callback_url);


--
-- Name: index_tags_on_name; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_tags_on_name ON public.tags USING btree (name);


--
-- Name: index_unique_conversations; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_unique_conversations ON public.account_conversations USING btree (account_id, conversation_id, participant_account_ids);


--
-- Name: index_users_on_account_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_users_on_account_id ON public.users USING btree (account_id);


--
-- Name: index_users_on_confirmation_token; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_users_on_confirmation_token ON public.users USING btree (confirmation_token);


--
-- Name: index_users_on_email; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_users_on_email ON public.users USING btree (email);


--
-- Name: index_users_on_reset_password_token; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_users_on_reset_password_token ON public.users USING btree (reset_password_token);


--
-- Name: index_web_push_subscriptions_on_access_token_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_web_push_subscriptions_on_access_token_id ON public.web_push_subscriptions USING btree (access_token_id);


--
-- Name: index_web_push_subscriptions_on_user_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX index_web_push_subscriptions_on_user_id ON public.web_push_subscriptions USING btree (user_id);


--
-- Name: index_web_settings_on_user_id; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE UNIQUE INDEX index_web_settings_on_user_id ON public.web_settings USING btree (user_id);


--
-- Name: search_index; Type: INDEX; Schema: public; Owner: pinafore
--

CREATE INDEX search_index ON public.accounts USING gin ((((setweight(to_tsvector('simple'::regconfig, (display_name)::text), 'A'::"char") || setweight(to_tsvector('simple'::regconfig, (username)::text), 'B'::"char")) || setweight(to_tsvector('simple'::regconfig, (COALESCE(domain, ''::character varying))::text), 'C'::"char"))));


--
-- Name: web_settings fk_11910667b2; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.web_settings
    ADD CONSTRAINT fk_11910667b2 FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: account_domain_blocks fk_206c6029bd; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.account_domain_blocks
    ADD CONSTRAINT fk_206c6029bd FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: conversation_mutes fk_225b4212bb; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.conversation_mutes
    ADD CONSTRAINT fk_225b4212bb FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: statuses_tags fk_3081861e21; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.statuses_tags
    ADD CONSTRAINT fk_3081861e21 FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;


--
-- Name: follows fk_32ed1b5560; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT fk_32ed1b5560 FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: oauth_access_grants fk_34d54b0a33; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.oauth_access_grants
    ADD CONSTRAINT fk_34d54b0a33 FOREIGN KEY (application_id) REFERENCES public.oauth_applications(id) ON DELETE CASCADE;


--
-- Name: blocks fk_4269e03e65; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.blocks
    ADD CONSTRAINT fk_4269e03e65 FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: reports fk_4b81f7522c; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT fk_4b81f7522c FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: users fk_50500f500d; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_50500f500d FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: stream_entries fk_5659b17554; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.stream_entries
    ADD CONSTRAINT fk_5659b17554 FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: favourites fk_5eb6c2b873; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.favourites
    ADD CONSTRAINT fk_5eb6c2b873 FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: oauth_access_grants fk_63b044929b; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.oauth_access_grants
    ADD CONSTRAINT fk_63b044929b FOREIGN KEY (resource_owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: imports fk_6db1b6e408; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.imports
    ADD CONSTRAINT fk_6db1b6e408 FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: follows fk_745ca29eac; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT fk_745ca29eac FOREIGN KEY (target_account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: follow_requests fk_76d644b0e7; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.follow_requests
    ADD CONSTRAINT fk_76d644b0e7 FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: follow_requests fk_9291ec025d; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.follow_requests
    ADD CONSTRAINT fk_9291ec025d FOREIGN KEY (target_account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: blocks fk_9571bfabc1; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.blocks
    ADD CONSTRAINT fk_9571bfabc1 FOREIGN KEY (target_account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: session_activations fk_957e5bda89; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.session_activations
    ADD CONSTRAINT fk_957e5bda89 FOREIGN KEY (access_token_id) REFERENCES public.oauth_access_tokens(id) ON DELETE CASCADE;


--
-- Name: media_attachments fk_96dd81e81b; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.media_attachments
    ADD CONSTRAINT fk_96dd81e81b FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE SET NULL;


--
-- Name: mentions fk_970d43f9d1; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.mentions
    ADD CONSTRAINT fk_970d43f9d1 FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: subscriptions fk_9847d1cbb5; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT fk_9847d1cbb5 FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: statuses fk_9bda1543f7; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.statuses
    ADD CONSTRAINT fk_9bda1543f7 FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: oauth_applications fk_b0988c7c0a; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.oauth_applications
    ADD CONSTRAINT fk_b0988c7c0a FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: favourites fk_b0e856845e; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.favourites
    ADD CONSTRAINT fk_b0e856845e FOREIGN KEY (status_id) REFERENCES public.statuses(id) ON DELETE CASCADE;


--
-- Name: mutes fk_b8d8daf315; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.mutes
    ADD CONSTRAINT fk_b8d8daf315 FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: reports fk_bca45b75fd; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT fk_bca45b75fd FOREIGN KEY (action_taken_by_account_id) REFERENCES public.accounts(id) ON DELETE SET NULL;


--
-- Name: notifications fk_c141c8ee55; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_c141c8ee55 FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: statuses fk_c7fa917661; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.statuses
    ADD CONSTRAINT fk_c7fa917661 FOREIGN KEY (in_reply_to_account_id) REFERENCES public.accounts(id) ON DELETE SET NULL;


--
-- Name: status_pins fk_d4cb435b62; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.status_pins
    ADD CONSTRAINT fk_d4cb435b62 FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: session_activations fk_e5fda67334; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.session_activations
    ADD CONSTRAINT fk_e5fda67334 FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: oauth_access_tokens fk_e84df68546; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.oauth_access_tokens
    ADD CONSTRAINT fk_e84df68546 FOREIGN KEY (resource_owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reports fk_eb37af34f0; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT fk_eb37af34f0 FOREIGN KEY (target_account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: mutes fk_eecff219ea; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.mutes
    ADD CONSTRAINT fk_eecff219ea FOREIGN KEY (target_account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: oauth_access_tokens fk_f5fc4c1ee3; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.oauth_access_tokens
    ADD CONSTRAINT fk_f5fc4c1ee3 FOREIGN KEY (application_id) REFERENCES public.oauth_applications(id) ON DELETE CASCADE;


--
-- Name: notifications fk_fbd6b0bf9e; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_fbd6b0bf9e FOREIGN KEY (from_account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: backups fk_rails_096669d221; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.backups
    ADD CONSTRAINT fk_rails_096669d221 FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: account_conversations fk_rails_1491654f9f; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.account_conversations
    ADD CONSTRAINT fk_rails_1491654f9f FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- Name: accounts fk_rails_2320833084; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT fk_rails_2320833084 FOREIGN KEY (moved_to_account_id) REFERENCES public.accounts(id) ON DELETE SET NULL;


--
-- Name: statuses fk_rails_256483a9ab; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.statuses
    ADD CONSTRAINT fk_rails_256483a9ab FOREIGN KEY (reblog_of_id) REFERENCES public.statuses(id) ON DELETE CASCADE;


--
-- Name: lists fk_rails_3853b78dac; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.lists
    ADD CONSTRAINT fk_rails_3853b78dac FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: media_attachments fk_rails_3ec0cfdd70; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.media_attachments
    ADD CONSTRAINT fk_rails_3ec0cfdd70 FOREIGN KEY (status_id) REFERENCES public.statuses(id) ON DELETE SET NULL;


--
-- Name: account_moderation_notes fk_rails_3f8b75089b; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.account_moderation_notes
    ADD CONSTRAINT fk_rails_3f8b75089b FOREIGN KEY (account_id) REFERENCES public.accounts(id);


--
-- Name: list_accounts fk_rails_40f9cc29f1; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.list_accounts
    ADD CONSTRAINT fk_rails_40f9cc29f1 FOREIGN KEY (follow_id) REFERENCES public.follows(id) ON DELETE CASCADE;


--
-- Name: status_stats fk_rails_4a247aac42; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.status_stats
    ADD CONSTRAINT fk_rails_4a247aac42 FOREIGN KEY (status_id) REFERENCES public.statuses(id) ON DELETE CASCADE;


--
-- Name: reports fk_rails_4e7a498fb4; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT fk_rails_4e7a498fb4 FOREIGN KEY (assigned_account_id) REFERENCES public.accounts(id) ON DELETE SET NULL;


--
-- Name: identities fk_rails_5373344100; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.identities
    ADD CONSTRAINT fk_rails_5373344100 FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: mentions fk_rails_59edbe2887; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.mentions
    ADD CONSTRAINT fk_rails_59edbe2887 FOREIGN KEY (status_id) REFERENCES public.statuses(id) ON DELETE CASCADE;


--
-- Name: conversation_mutes fk_rails_5ab139311f; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.conversation_mutes
    ADD CONSTRAINT fk_rails_5ab139311f FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- Name: status_pins fk_rails_65c05552f1; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.status_pins
    ADD CONSTRAINT fk_rails_65c05552f1 FOREIGN KEY (status_id) REFERENCES public.statuses(id) ON DELETE CASCADE;


--
-- Name: account_conversations fk_rails_6f5278b6e9; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.account_conversations
    ADD CONSTRAINT fk_rails_6f5278b6e9 FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: web_push_subscriptions fk_rails_751a9f390b; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.web_push_subscriptions
    ADD CONSTRAINT fk_rails_751a9f390b FOREIGN KEY (access_token_id) REFERENCES public.oauth_access_tokens(id) ON DELETE CASCADE;


--
-- Name: report_notes fk_rails_7fa83a61eb; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.report_notes
    ADD CONSTRAINT fk_rails_7fa83a61eb FOREIGN KEY (report_id) REFERENCES public.reports(id) ON DELETE CASCADE;


--
-- Name: list_accounts fk_rails_85fee9d6ab; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.list_accounts
    ADD CONSTRAINT fk_rails_85fee9d6ab FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: custom_filters fk_rails_8b8d786993; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.custom_filters
    ADD CONSTRAINT fk_rails_8b8d786993 FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: users fk_rails_8fb2a43e88; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_rails_8fb2a43e88 FOREIGN KEY (invite_id) REFERENCES public.invites(id) ON DELETE SET NULL;


--
-- Name: statuses fk_rails_94a6f70399; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.statuses
    ADD CONSTRAINT fk_rails_94a6f70399 FOREIGN KEY (in_reply_to_id) REFERENCES public.statuses(id) ON DELETE SET NULL;


--
-- Name: account_pins fk_rails_a176e26c37; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.account_pins
    ADD CONSTRAINT fk_rails_a176e26c37 FOREIGN KEY (target_account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: admin_action_logs fk_rails_a7667297fa; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.admin_action_logs
    ADD CONSTRAINT fk_rails_a7667297fa FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: web_push_subscriptions fk_rails_b006f28dac; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.web_push_subscriptions
    ADD CONSTRAINT fk_rails_b006f28dac FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: report_notes fk_rails_cae66353f3; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.report_notes
    ADD CONSTRAINT fk_rails_cae66353f3 FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: account_pins fk_rails_d44979e5dd; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.account_pins
    ADD CONSTRAINT fk_rails_d44979e5dd FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: account_moderation_notes fk_rails_dd62ed5ac3; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.account_moderation_notes
    ADD CONSTRAINT fk_rails_dd62ed5ac3 FOREIGN KEY (target_account_id) REFERENCES public.accounts(id);


--
-- Name: statuses_tags fk_rails_df0fe11427; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.statuses_tags
    ADD CONSTRAINT fk_rails_df0fe11427 FOREIGN KEY (status_id) REFERENCES public.statuses(id) ON DELETE CASCADE;


--
-- Name: list_accounts fk_rails_e54e356c88; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.list_accounts
    ADD CONSTRAINT fk_rails_e54e356c88 FOREIGN KEY (list_id) REFERENCES public.lists(id) ON DELETE CASCADE;


--
-- Name: invites fk_rails_ff69dbb2ac; Type: FK CONSTRAINT; Schema: public; Owner: pinafore
--

ALTER TABLE ONLY public.invites
    ADD CONSTRAINT fk_rails_ff69dbb2ac FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

