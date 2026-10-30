# Etapa de compilação
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copia arquivo do projeto e restaura dependências
COPY backend.csproj ./
RUN dotnet restore

# Copia todo o código-fonte e publica em modo Release
COPY . ./
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Etapa de execução
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# Define porta padrão do serviço
ENV ASPNETCORE_URLS=http://+:5008
EXPOSE 5008

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "backend.dll"]
