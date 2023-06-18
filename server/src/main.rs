use clap::{Parser, Subcommand};
use hyper::http::{HeaderValue, Method};
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::SqlitePool;
use tower::ServiceBuilder;
use tower_http::{
    cors::{Any, CorsLayer},
    timeout::TimeoutLayer,
};

#[derive(Parser, Debug)]
struct Cli {
    #[command(subcommand)]
    command: Command,
}

#[derive(Subcommand, Debug)]
enum Command {
    Migrate,
    Serve {
        #[arg(short, long)]
        port: u16,
    },
}

#[tokio::main]
async fn main() {
    let cli = Cli::parse();

    let db_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let sqlite_connection = SqlitePoolOptions::new()
        .max_connections(10)
        .connect(&db_url)
        .await
        .expect("couldn't connect to the database");

    let sqlite_version = sqlx::query_scalar!(r#"select sqlite_version() as "sqlite_version!""#)
        .fetch_one(&sqlite_connection)
        .await
        .expect("could not obtain sqlite version");

    println!("Using sqlite version {sqlite_version}");

    match &cli.command {
        Command::Migrate => migrate(sqlite_connection).await,
        Command::Serve { port } => serve(sqlite_connection, port).await,
    }
}

async fn migrate(sqlite_connection: SqlitePool) {
    println!("Running pending migrations");
    sqlx::migrate!().run(&sqlite_connection).await.unwrap()
}

async fn serve(sqlite_connection: SqlitePool, port: &u16) {
    let app_url = std::env::var("APP_URL").expect("APP_URL must be set");

    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST])
        .allow_headers(Any)
        .allow_origin(app_url.parse::<HeaderValue>().unwrap());

    let timeout = TimeoutLayer::new(std::time::Duration::from_secs(5));

    let app = server::routes::create_router()
        .with_state(server::ApiState {
            db: sqlite_connection,
            slugger: server::Slugger::new(),
        })
        .layer(ServiceBuilder::new().layer(cors).layer(timeout));

    println!("Starting server on port {port}");
    // Listen on both IPv4 and IPv6
    let addr = format!("[::]:{port}").parse().unwrap();
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}