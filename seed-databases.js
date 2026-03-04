#!/usr/bin/env node
/**
 * Seed script for Kanban tasks and FalkorDB orgchart
 * Run: node seed-databases.js
 */

const http = require('http');

// Seed tasks for Supabase
const initialTasks = [
    {
        title: 'Implementar dashboard de KPIs',
        description: 'Crear dashboard con métricas principales del sistema',
        assignee: 'torrente',
        status: 'in_progress',
        priority: 'alta',
        notes: 'Usar Charts.js para visualización'
    },
    {
        title: 'Optimizar queries de trading bot',
        description: 'Reducir latencia en consultas a la base de datos',
        assignee: 'peter',
        status: 'discovering',
        priority: 'alta',
        notes: 'Revisar índices y caching'
    },
    {
        title: 'Documentar API de Vision',
        description: 'Escribir documentación completa para endpoints de cámaras',
        assignee: 'torrente',
        status: 'pending',
        priority: 'media'
    },
    {
        title: 'Testing de seguridad',
        description: 'Realizar pentesting de la plataforma',
        assignee: 'jefe',
        status: 'pending',
        priority: 'alta'
    },
    {
        title: 'Integrar notificaciones Telegram',
        description: 'Añadir bot de Telegram para alertas',
        assignee: 'torrente',
        status: 'almost_done',
        priority: 'media',
        notes: 'Ya funciona el envío, falta configuración'
    },
    {
        title: 'Backup automático diario',
        description: 'Configurar backups automáticos de todas las bases de datos',
        assignee: 'jefe',
        status: 'done',
        priority: 'alta'
    }
];

// Seed orgchart for FalkorDB
const orgchartQueries = [
    // Create nodes
    "CREATE (n:Node {name:'Jefe', type:'ceo'})",
    "CREATE (n:Node {name:'IA', type:'dept'})",
    "CREATE (n:Node {name:'Trading', type:'dept'})",
    "CREATE (n:Node {name:'Seguridad', type:'dept'})",
    "CREATE (n:Node {name:'Energía', type:'dept'})",
    "CREATE (n:Node {name:'Vision', type:'dept'})",
    "CREATE (n:Node {name:'Torrente', type:'person'})",
    "CREATE (n:Node {name:'Peter', type:'person'})",
    "CREATE (n:Node {name:'Claude', type:'person'})",
    "CREATE (n:Node {name:'Atlas', type:'person'})",
    "CREATE (n:Node {name:'Nova', type:'person'})",
    
    // Create relationships
    "MATCH (a:Node {name:'Jefe'}), (b:Node {name:'IA'}) CREATE (a)-[:MANAGES]->(b)",
    "MATCH (a:Node {name:'Jefe'}), (b:Node {name:'Trading'}) CREATE (a)-[:MANAGES]->(b)",
    "MATCH (a:Node {name:'Jefe'}), (b:Node {name:'Seguridad'}) CREATE (a)-[:MANAGES]->(b)",
    "MATCH (a:Node {name:'Jefe'}), (b:Node {name:'Energía'}) CREATE (a)-[:MANAGES]->(b)",
    "MATCH (a:Node {name:'Jefe'}), (b:Node {name:'Vision'}) CREATE (a)-[:MANAGES]->(b)",
    
    "MATCH (a:Node {name:'Torrente'}), (b:Node {name:'IA'}) CREATE (a)-[:WORKS_IN]->(b)",
    "MATCH (a:Node {name:'Peter'}), (b:Node {name:'Trading'}) CREATE (a)-[:WORKS_IN]->(b)",
    "MATCH (a:Node {name:'Claude'}), (b:Node {name:'IA'}) CREATE (a)-[:WORKS_IN]->(b)",
    "MATCH (a:Node {name:'Atlas'}), (b:Node {name:'Seguridad'}) CREATE (a)-[:WORKS_IN]->(b)",
    "MATCH (a:Node {name:'Nova'}), (b:Node {name:'Vision'}) CREATE (a)-[:WORKS_IN]->(b)",
    
    "MATCH (a:Node {name:'Torrente'}), (b:Node {name:'Jefe'}) CREATE (a)-[:REPORTS_TO]->(b)",
    "MATCH (a:Node {name:'Peter'}), (b:Node {name:'Jefe'}) CREATE (a)-[:REPORTS_TO]->(b)"
];

async function seedSupabase() {
    console.log('🌱 Seeding Supabase tasks...');
    
    for (const task of initialTasks) {
        try {
            const data = JSON.stringify(task);
            const options = {
                hostname: '127.0.0.1',
                port: 3001,
                path: '/tasks',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length,
                    'Prefer': 'return=representation'
                }
            };
            
            await new Promise((resolve, reject) => {
                const req = http.request(options, (res) => {
                    let body = '';
                    res.on('data', chunk => body += chunk);
                    res.on('end', () => {
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            console.log(`  ✅ Created task: ${task.title}`);
                            resolve();
                        } else {
                            console.log(`  ⚠️  Failed: ${task.title} (${res.statusCode})`);
                            resolve(); // Continue even if fails
                        }
                    });
                });
                req.on('error', (e) => {
                    console.log(`  ❌ Error: ${e.message}`);
                    resolve();
                });
                req.write(data);
                req.end();
            });
        } catch (e) {
            console.log(`  ❌ Error: ${e.message}`);
        }
    }
}

async function seedFalkorDB() {
    console.log('\n🌱 Seeding FalkorDB orgchart...');
    
    try {
        const Redis = require('ioredis');
        const graphClient = new Redis(6379, '127.0.0.1');
        
        // Clear existing graph
        try {
            await graphClient.call('GRAPH.DELETE', 'orgchart');
            console.log('  🗑️  Cleared existing orgchart');
        } catch (e) {
            // Graph might not exist
        }
        
        // Execute queries
        for (const query of orgchartQueries) {
            try {
                await graphClient.call('GRAPH.QUERY', 'orgchart', query);
                console.log(`  ✅ ${query.substring(0, 50)}...`);
            } catch (e) {
                console.log(`  ⚠️  Query failed: ${e.message}`);
            }
        }
        
        await graphClient.quit();
        console.log('  ✅ FalkorDB seeding complete');
    } catch (e) {
        console.log(`  ❌ FalkorDB error: ${e.message}`);
        console.log('  ⚠️  Make sure ioredis is installed: npm install ioredis');
    }
}

async function main() {
    console.log('🚀 πφe Database Seeding\n');
    
    await seedSupabase();
    await seedFalkorDB();
    
    console.log('\n✅ Seeding complete!');
    process.exit(0);
}

main().catch(console.error);
