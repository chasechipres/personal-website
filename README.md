# chasechipres.com

Static site for https://chasechipres.com.

## Hosting

- Oracle Cloud VM (Ubuntu 24.04) running nginx
- Web root: `/var/www/html`, owned by `www-data`
- Cloudflare DNS (proxied), SSL mode Full (strict), Let's Encrypt cert via certbot

## Deploy

From this folder on Windows (replace `<vm-ip>` with the VM's public IP from the
Oracle console, Compute → Instances):

```powershell
ssh -i $HOME\.ssh\oracle.key ubuntu@<vm-ip> "rm -rf ~/site-upload && mkdir ~/site-upload"
scp -i $HOME\.ssh\oracle.key index.html style.css ubuntu@<vm-ip>:~/site-upload/
ssh -i $HOME\.ssh\oracle.key ubuntu@<vm-ip> "sudo cp -r ~/site-upload/* /var/www/html/ && sudo chown -R www-data:www-data /var/www/html"
```

Then purge the Cloudflare cache (Caching → Purge Everything) or hard-refresh.
