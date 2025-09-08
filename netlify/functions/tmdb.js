export const handler = async (event) => {
  try {
    const v4Token = process.env.TMDB_API_TOKEN; // TMDb v4 Read Access Token (JWT)
    const v3Key = process.env.TMDB_API_KEY_V3;  // TMDb API Key (v3)
    const useV4 = Boolean(v4Token);
    const useV3 = !useV4 && Boolean(v3Key);
    if (!useV4 && !useV3) {
      return { statusCode: 500, body: "TMDB credentials not configured" };
    }

    // Expecting path like: search/movie, discover/movie, movie/123
    const pathParam = (event.queryStringParameters?.path || "").replace(/^\/+/, "");
    if (!pathParam) {
      return { statusCode: 400, body: "Missing path parameter" };
    }

    const [firstSegment] = pathParam.split("/");
    const allowed = new Set(["search", "discover", "movie"]);
    if (!allowed.has(firstSegment)) {
      return { statusCode: 400, body: "Unsupported path" };
    }

    const tmdbUrl = new URL(`https://api.themoviedb.org/3/${pathParam}`);
    for (const [key, value] of Object.entries(event.queryStringParameters || {})) {
      if (key !== "path") tmdbUrl.searchParams.set(key, value);
    }
    if (useV3) {
      tmdbUrl.searchParams.set("api_key", v3Key);
    }

    const res = await fetch(tmdbUrl.toString(), {
      method: "GET",
      headers: {
        accept: "application/json",
        ...(useV4 ? { Authorization: `Bearer ${v4Token}` } : {}),
      },
    });

    const body = await res.text();
    return { statusCode: res.status, body };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "Internal Server Error" }) };
  }
};


