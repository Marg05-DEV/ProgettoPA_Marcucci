
-- 'progetto_pa_db' database creation 

CREATE DATABASE progetto_pa_db;


-- 'progetto_pa_db' connection

\connect progetto_pa_db;


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	user_id serial4 NOT NULL,
	username varchar(50) NOT NULL,
	email varchar(100) NOT NULL,
	"password" varchar(255) NOT NULL,
	is_admin bool DEFAULT false NOT NULL,
	qty_token float8 DEFAULT 0 NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (user_id)
);


-- public.graphs definition

-- Drop table

-- DROP TABLE public.graphs;

CREATE TABLE public.graphs (
	graph_id serial4 NOT NULL,
	user_id int4 NOT NULL,
	"name" varchar(100) NOT NULL,
	description text NULL,
	"cost" float8 DEFAULT 0 NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL, -- when graph is created, updated_at is equal to created_at. Then, created_at is blocked, while updated_at changes when the graph is updated
	CONSTRAINT graphs_pkey PRIMARY KEY (graph_id),
	CONSTRAINT fk_graphs_user FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);


-- public.edges definition

-- Drop table

-- DROP TABLE public.edges;

CREATE TABLE public.edges (
	edge_id serial4 NOT NULL,
	graph_id int4 NOT NULL,
	start_node varchar(50) NOT NULL,
	end_node varchar(50) NOT NULL,
	weight float8 NOT NULL,
	CONSTRAINT edges_pkey PRIMARY KEY (edge_id),
	CONSTRAINT fk_edges_graph FOREIGN KEY (graph_id) REFERENCES public.graphs(graph_id)
);


-- public.update_logs definition

-- Drop table

-- DROP TABLE public.update_logs;

CREATE TABLE public.update_logs (
	update_id serial4 NOT NULL,
	requested_by int4 NOT NULL, -- user that requested the update
	edge_id int4 NOT NULL,
	status varchar(20) DEFAULT 'pending'::character varying NOT NULL,
	old_weight float8 NOT NULL,
	new_weight float8 NOT NULL,
	resolved_by int4 NULL, -- user admin that resolves the update. Is NULL if the update is automatically resolved (under the threshold)
	requested_at timestamp DEFAULT now() NOT NULL, -- timestamp of the update request by user
	resolved_at timestamp NULL, -- timestamp of the update resolution by admin. Is equal to requested_at if the update is automatically resolved (under the threshold)
	CONSTRAINT check_status CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[]))),
	CONSTRAINT update_logs_pkey PRIMARY KEY (update_id),
	CONSTRAINT fk_logs_admin FOREIGN KEY (resolved_by) REFERENCES public.users(user_id),
	CONSTRAINT fk_logs_edge FOREIGN KEY (edge_id) REFERENCES public.edges(edge_id),
	CONSTRAINT fk_logs_editor FOREIGN KEY (requested_by) REFERENCES public.users(user_id)
);